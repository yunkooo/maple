import { describe, expect, it } from 'vitest'
import { formatNumber } from './equipmentFormatters'

describe('equipment formatters', () => {
  it('비어있는 숫자 값을 대시로 표시한다', () => {
    expect(formatNumber(null)).toBe('-')
    expect(formatNumber(undefined)).toBe('-')
    expect(formatNumber('')).toBe('-')
  })

  it('숫자와 콤마 문자열을 천 단위로 표시한다', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
    expect(formatNumber('1,234,567')).toBe('1,234,567')
  })
})
