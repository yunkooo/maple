import { describe, expect, it, vi } from 'vitest'
import {
  LAST_SUCCESSFUL_CHARACTER_NICKNAME_STORAGE_KEY,
  getStoredLastSuccessfulCharacterNickname,
  setStoredLastSuccessfulCharacterNickname
} from './lastSuccessfulCharacter'

const createStorage = () => {
  const values = new Map<string, string>()

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value)
    })
  }
}

describe('lastSuccessfulCharacter', () => {
  it('마지막 성공 캐릭터 닉네임을 trim해서 저장하고 읽는다', () => {
    const storage = createStorage()

    expect(setStoredLastSuccessfulCharacterNickname('  츄니  ', storage)).toBe(
      '츄니'
    )
    expect(storage.setItem).toHaveBeenCalledWith(
      LAST_SUCCESSFUL_CHARACTER_NICKNAME_STORAGE_KEY,
      '츄니'
    )
    expect(getStoredLastSuccessfulCharacterNickname(storage)).toBe('츄니')
  })

  it('빈 닉네임은 마지막 성공 캐릭터로 저장하지 않는다', () => {
    const storage = createStorage()

    expect(setStoredLastSuccessfulCharacterNickname('   ', storage)).toBe('')
    expect(storage.setItem).not.toHaveBeenCalled()
  })
})
