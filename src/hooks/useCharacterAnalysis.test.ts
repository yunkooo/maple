import { describe, expect, it, vi } from 'vitest'
import * as characterApi from '@/api/character'
import { getCharacterAnalysis } from './useCharacterAnalysis'

vi.mock('@/api/character', () => ({
  getAbility: vi.fn(),
  getCharacterSkill: vi.fn(),
  getCharacterStat: vi.fn(),
  getHexaMatrix: vi.fn(),
  getHexaMatrixStat: vi.fn(),
  getLinkSkill: vi.fn(),
  getSetEffect: vi.fn(),
  getSymbolEquipment: vi.fn(),
  getUnion: vi.fn(),
  getUnionArtifact: vi.fn(),
  getUnionChampion: vi.fn(),
  getUnionRaider: vi.fn()
}))

const analysisApiFunctions = [
  characterApi.getCharacterStat,
  characterApi.getSetEffect,
  characterApi.getAbility,
  characterApi.getSymbolEquipment,
  characterApi.getLinkSkill,
  characterApi.getUnion,
  characterApi.getUnionRaider,
  characterApi.getUnionArtifact,
  characterApi.getUnionChampion,
  characterApi.getHexaMatrix,
  characterApi.getHexaMatrixStat,
  characterApi.getCharacterSkill
] as Array<ReturnType<typeof vi.fn>>

describe('getCharacterAnalysis', () => {
  it('모든 분석 API가 실패하면 쿼리 에러로 처리할 수 있게 예외를 던진다', async () => {
    analysisApiFunctions.forEach(apiFn => {
      apiFn.mockRejectedValue(new Error('API failed'))
    })

    await expect(getCharacterAnalysis('ocid', '2026-05-11')).rejects.toThrow(
      '캐릭터 분석 데이터를 불러오지 못했습니다.'
    )
  })

  it('일부 분석 API만 성공하면 성공한 데이터는 유지하고 실패한 항목만 비운다', async () => {
    const stat = {
      character_class: '아델',
      final_stat: []
    }

    analysisApiFunctions.forEach(apiFn => {
      apiFn.mockRejectedValue(new Error('API failed'))
    })
    vi.mocked(characterApi.getCharacterStat).mockResolvedValue(stat)

    await expect(
      getCharacterAnalysis('ocid', '2026-05-11')
    ).resolves.toMatchObject({
      stat,
      ability: null
    })
  })
})
