import { describe, expect, it } from 'vitest'
import {
  shouldShowCharacterLookupPending,
  shouldShowCharacterNotFoundFallback
} from './characterInfo.utils'

describe('shouldShowCharacterNotFoundFallback', () => {
  it('닉네임 조회가 실패하면 fallback을 보여준다', () => {
    expect(
      shouldShowCharacterNotFoundFallback({
        errorMessage: '캐릭터 조회에 실패했습니다. (OPENAPI00004)',
        nickname: '없는캐릭터',
        ocid: undefined,
        status: 'error'
      })
    ).toBe(true)
  })

  it('닉네임이 있는데 조회가 끝난 뒤 ocid가 없으면 fallback을 보여준다', () => {
    expect(
      shouldShowCharacterNotFoundFallback({
        errorMessage: '',
        nickname: '없는캐릭터',
        ocid: undefined,
        status: 'idle'
      })
    ).toBe(true)
  })

  it('조회 중이거나 정상 ocid가 있으면 fallback을 보여주지 않는다', () => {
    expect(
      shouldShowCharacterNotFoundFallback({
        errorMessage: '',
        nickname: '아델',
        ocid: undefined,
        status: 'loading'
      })
    ).toBe(false)

    expect(
      shouldShowCharacterNotFoundFallback({
        errorMessage: '',
        nickname: '아델',
        ocid: 'abc',
        status: 'idle'
      })
    ).toBe(false)
  })

  it('ocid가 있어도 기본 캐릭터 정보가 비어 있으면 fallback을 보여준다', () => {
    expect(
      shouldShowCharacterNotFoundFallback({
        basicData: {
          character_class: '',
          character_class_level: '',
          character_exp: 0,
          character_exp_rate: '0',
          character_gender: '',
          character_guild_name: '',
          character_image: '',
          character_level: 0,
          character_name: '',
          date: '2026-05-11',
          world_name: ''
        },
        basicStatus: 'idle',
        errorMessage: '',
        nickname: '없는캐릭터',
        ocid: 'abc',
        status: 'idle'
      })
    ).toBe(true)
  })
})

describe('shouldShowCharacterLookupPending', () => {
  it('닉네임 조회 중이면 빈 캐릭터 화면 대신 대기 UI를 보여준다', () => {
    expect(
      shouldShowCharacterLookupPending({
        basicStatus: 'idle',
        nickname: '없는캐릭터',
        ocid: undefined,
        status: 'loading'
      })
    ).toBe(true)
  })

  it('ocid를 찾은 뒤 기본 캐릭터 정보를 조회 중이면 대기 UI를 보여준다', () => {
    expect(
      shouldShowCharacterLookupPending({
        basicStatus: 'loading',
        nickname: '아델',
        ocid: 'abc',
        status: 'idle'
      })
    ).toBe(true)
  })

  it('조회 실패나 정상 데이터 상태에서는 대기 UI를 보여주지 않는다', () => {
    expect(
      shouldShowCharacterLookupPending({
        basicStatus: 'idle',
        nickname: '없는캐릭터',
        ocid: undefined,
        status: 'error'
      })
    ).toBe(false)

    expect(
      shouldShowCharacterLookupPending({
        basicStatus: 'idle',
        nickname: '아델',
        ocid: 'abc',
        status: 'idle'
      })
    ).toBe(false)
  })
})
