import { CashEquipmentResponse, CashItem } from '@/api/character.types'

export type PresetNumber = 1 | 2 | 3

export type CodyViewKey = 'base' | PresetNumber

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
