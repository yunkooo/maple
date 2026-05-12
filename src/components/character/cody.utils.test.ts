import { describe, expect, it } from 'vitest'
import type { CashItem } from '@/api/character.types'
import {
  formatCashItemDate,
  getCashItemOptionRows,
  getCashItemPrismSummary
} from './cody.utils'

const createCashItem = (overrides: Partial<CashItem> = {}): CashItem => ({
  cash_item_coloring_prism: {
    color_range: '',
    hue: 0,
    saturation: 0,
    value: 0
  },
  cash_item_description: '',
  cash_item_equipment_part: '무기',
  cash_item_equipment_slot: '무기',
  cash_item_icon: '',
  cash_item_label: '',
  cash_item_name: '드리밍 스타',
  cash_item_option: [],
  date_expire: '',
  date_option_expire: '',
  item_gender: '',
  ...overrides
})

describe('cody detail helpers', () => {
  it('컬러프리즘 색상과 HSV 값을 상세 정보로 만든다', () => {
    const item = createCashItem({
      cash_item_coloring_prism: {
        color_range: '검은색 계열',
        hue: 12,
        saturation: 34,
        value: 56
      }
    })

    expect(getCashItemPrismSummary(item)).toEqual({
      colorRange: '검은색 계열',
      values: '색조 12 · 채도 34 · 명도 56'
    })
  })

  it('옵션 타입과 값을 비어있는 항목 없이 정리한다', () => {
    const item = createCashItem({
      cash_item_option: [
        { option_type: 'STR', option_value: '+3' },
        { option_type: 'DEX', option_value: '' },
        { option_type: '', option_value: '+5' }
      ]
    })

    expect(getCashItemOptionRows(item)).toEqual([{ label: 'STR', value: '+3' }])
  })

  it('캐시 아이템 날짜를 읽기 쉬운 형식으로 표시한다', () => {
    expect(formatCashItemDate('2026-05-12T03:04:00')).toBe(
      '2026년 5월 12일 03시 04분'
    )
    expect(formatCashItemDate('기간 제한 없음')).toBe('기간 제한 없음')
  })
})
