import {
  BeautyEquipmentResponse,
  CashEquipmentResponse,
  CashItem
} from '@/api/character.types'

export type PresetNumber = 1 | 2 | 3

export type CodyViewKey = 'base' | PresetNumber

export type CashItemOptionRow = {
  label: string
  value: string
}

export type CashItemPrismSummary = {
  colorRange: string
  values: string
}

export const CASH_PRESET_NUMBERS = [1, 2, 3] as const

export function getActivePresetNumber(
  cashData: CashEquipmentResponse | null
): PresetNumber {
  if (cashData?.preset_no === 2 || cashData?.preset_no === 3) {
    return cashData.preset_no
  }

  return 1
}

export function getCashItemsByPreset(
  cashData: CashEquipmentResponse | null,
  presetNo: PresetNumber,
  isAdditional = false
): CashItem[] {
  if (cashData === null) {
    return []
  }

  if (isAdditional) {
    const presetItems =
      presetNo === 1
        ? cashData.additional_cash_item_equipment_preset_1
        : presetNo === 2
          ? cashData.additional_cash_item_equipment_preset_2
          : cashData.additional_cash_item_equipment_preset_3

    return presetItems || cashData.additional_cash_item_equipment_base || []
  }

  const presetItems =
    presetNo === 1
      ? cashData.cash_item_equipment_preset_1
      : presetNo === 2
        ? cashData.cash_item_equipment_preset_2
        : cashData.cash_item_equipment_preset_3

  return presetItems || cashData.cash_item_equipment_base || []
}

export function getBaseCashItems(
  cashData: CashEquipmentResponse | null,
  isAdditional = false
): CashItem[] {
  if (cashData === null) {
    return []
  }

  return isAdditional
    ? cashData.additional_cash_item_equipment_base || []
    : cashData.cash_item_equipment_base || []
}

export function getActiveCashItems(
  cashData: CashEquipmentResponse | null,
  isAdditional = false
): CashItem[] {
  return getCashItemsByPreset(
    cashData,
    getActivePresetNumber(cashData),
    isAdditional
  )
}

export function findCashItemBySlot(
  cashItems: CashItem[],
  slot: string
): CashItem | undefined {
  return cashItems.find(item => item.cash_item_equipment_slot === slot)
}

export function sortCashItemsBySlot(cashItems: CashItem[]): CashItem[] {
  const slotOrder = [
    '모자',
    '얼굴장식',
    '눈장식',
    '귀고리',
    '상의',
    '하의',
    '신발',
    '장갑',
    '망토',
    '무기',
    '반지'
  ]

  return [...cashItems].sort((left, right) => {
    const leftIndex = slotOrder.indexOf(left.cash_item_equipment_slot)
    const rightIndex = slotOrder.indexOf(right.cash_item_equipment_slot)

    if (leftIndex === -1 && rightIndex === -1) {
      return left.cash_item_equipment_slot.localeCompare(
        right.cash_item_equipment_slot,
        'ko'
      )
    }

    if (leftIndex === -1) {
      return 1
    }

    if (rightIndex === -1) {
      return -1
    }

    return leftIndex - rightIndex
  })
}

const trimText = (value?: string | null) => value?.trim() || ''

const formatPrismValue = (value: number) =>
  Number.isFinite(value) ? String(value) : '-'

export function getBeautyHairName(
  beautyData: BeautyEquipmentResponse | null | undefined,
  fallback = '-'
) {
  return trimText(beautyData?.character_hair?.hair_name) || fallback
}

export function getBeautyFaceName(
  beautyData: BeautyEquipmentResponse | null | undefined,
  fallback = '-'
) {
  return trimText(beautyData?.character_face?.face_name) || fallback
}

export function getBeautySkinName(
  beautyData: BeautyEquipmentResponse | null | undefined,
  fallback = '-'
) {
  return trimText(beautyData?.character_skin_name) || fallback
}

export function getCashItemPrismSummary(
  item: CashItem
): CashItemPrismSummary | undefined {
  const prism = item.cash_item_coloring_prism

  if (!prism) {
    return undefined
  }

  const colorRange = trimText(prism.color_range)
  const hasPrismValue = [prism.hue, prism.saturation, prism.value].some(
    value => Number.isFinite(value) && value !== 0
  )

  if (!colorRange && !hasPrismValue) {
    return undefined
  }

  return {
    colorRange: colorRange || '색상 정보 없음',
    values: `색조 ${formatPrismValue(prism.hue)} · 채도 ${formatPrismValue(
      prism.saturation
    )} · 명도 ${formatPrismValue(prism.value)}`
  }
}

export function getCashItemOptionRows(item: CashItem): CashItemOptionRow[] {
  return item.cash_item_option
    .map(option => ({
      label: trimText(option.option_type),
      value: trimText(option.option_value)
    }))
    .filter(option => option.label !== '' && option.value !== '')
}

export function formatCashItemDate(value?: string | null) {
  const trimmedValue = trimText(value)

  if (!trimmedValue) {
    return undefined
  }

  const date = new Date(trimmedValue)

  if (Number.isNaN(date.getTime())) {
    return trimmedValue
  }

  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${date.getFullYear()}년 ${month}월 ${day}일 ${hour}시 ${minute}분`
}
