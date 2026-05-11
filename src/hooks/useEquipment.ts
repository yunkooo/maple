import { getEquipment } from '@/api/character'
import {
  Equipment,
  EquipmentPresetNo,
  EquipmentResponse,
  RequestStatus
} from '@/api/character.types'
import { getMapleApiDate } from '@/lib/mapleDate'
import { queryCacheTime } from '@/lib/queryCache'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

const EQUIPMENT_PRESET_NOS = [1, 2, 3] as const

type EquipmentPresetMap = Record<EquipmentPresetNo, Equipment[]>

type EquipmentState = {
  baseEquipmentData: Equipment[]
  presetEquipmentData: EquipmentPresetMap
  currentPresetNo: EquipmentPresetNo | undefined
}

export type EquipmentPreset = {
  presetNo: EquipmentPresetNo
  equipmentData: Equipment[]
  isCurrent: boolean
  isActive: boolean
}

const createEmptyPresetMap = (): EquipmentPresetMap => ({
  1: [],
  2: [],
  3: []
})

const createEmptyEquipmentState = (): EquipmentState => ({
  baseEquipmentData: [],
  presetEquipmentData: createEmptyPresetMap(),
  currentPresetNo: undefined
})

const isEquipmentPresetNo = (
  presetNo: EquipmentResponse['preset_no']
): presetNo is EquipmentPresetNo =>
  EQUIPMENT_PRESET_NOS.some(equipmentPresetNo => equipmentPresetNo === presetNo)

const getPresetEquipmentResponse = (
  equipmentDataResponse: EquipmentResponse,
  presetNo: EquipmentPresetNo
) => {
  switch (presetNo) {
    case 1:
      return equipmentDataResponse.item_equipment_preset_1
    case 2:
      return equipmentDataResponse.item_equipment_preset_2
    case 3:
      return equipmentDataResponse.item_equipment_preset_3
  }
}

const getPresetEquipmentData = (
  equipmentDataResponse: EquipmentResponse,
  presetNo: EquipmentPresetNo,
  baseEquipmentData: Equipment[]
) =>
  getPresetEquipmentResponse(equipmentDataResponse, presetNo) ??
  baseEquipmentData

const createEquipmentState = (
  equipmentDataResponse: EquipmentResponse
): EquipmentState => {
  const baseEquipmentData = equipmentDataResponse.item_equipment ?? []
  const currentPresetNo = isEquipmentPresetNo(equipmentDataResponse.preset_no)
    ? equipmentDataResponse.preset_no
    : undefined
  const presetEquipmentData: EquipmentPresetMap = {
    1: getPresetEquipmentData(equipmentDataResponse, 1, baseEquipmentData),
    2: getPresetEquipmentData(equipmentDataResponse, 2, baseEquipmentData),
    3: getPresetEquipmentData(equipmentDataResponse, 3, baseEquipmentData)
  }

  return {
    baseEquipmentData,
    presetEquipmentData,
    currentPresetNo
  }
}

export function useEquipment(ocid: string | undefined) {
  const [activePresetNo, setActivePresetNo] = useState<
    EquipmentPresetNo | undefined
  >()
  const date = getMapleApiDate()
  const query = useQuery({
    enabled: Boolean(ocid),
    gcTime: queryCacheTime.characterDailyData.gcTime,
    queryFn: async () =>
      createEquipmentState(await getEquipment(ocid || '', date)),
    queryKey: ['character', 'equipment', ocid, date],
    staleTime: queryCacheTime.characterDailyData.staleTime
  })
  const equipmentState = query.data ?? createEmptyEquipmentState()

  useEffect(() => {
    setActivePresetNo(query.data?.currentPresetNo)
  }, [query.data?.currentPresetNo])

  const equipmentData = activePresetNo
    ? equipmentState.presetEquipmentData[activePresetNo] || []
    : equipmentState.baseEquipmentData
  const presets = useMemo<EquipmentPreset[]>(
    () =>
      EQUIPMENT_PRESET_NOS.map(presetNo => ({
        presetNo,
        equipmentData: equipmentState.presetEquipmentData[presetNo] || [],
        isCurrent: equipmentState.currentPresetNo === presetNo,
        isActive: activePresetNo === presetNo
      })),
    [
      activePresetNo,
      equipmentState.currentPresetNo,
      equipmentState.presetEquipmentData
    ]
  )
  const status: RequestStatus = !ocid
    ? 'idle'
    : query.isLoading
      ? 'loading'
      : query.isError
        ? 'error'
        : 'idle'

  return {
    equipmentData,
    presets,
    activePresetNo,
    currentPresetNo: equipmentState.currentPresetNo,
    setActivePresetNo,
    status
  }
}
