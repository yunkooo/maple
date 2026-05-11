import { describe, expect, it } from 'vitest'
import type { CashItem, CharacterBasic, Equipment } from '@/api/character.types'
import { generateCharacterNicknames } from './nicknameGenerator'

const basic: CharacterBasic = {
  character_class: '아델',
  character_class_level: '6',
  character_exp: 0,
  character_exp_rate: '0',
  character_gender: '남',
  character_guild_name: '테스트길드',
  character_image: '',
  character_level: 285,
  character_name: '므래',
  date: '2026-05-11',
  world_name: '스카니아'
}

const equipment: Equipment[] = [
  {
    item_equipment_part: '무기',
    item_equipment_slot: '무기',
    item_name: '제네시스 튜너',
    starforce: '22'
  }
]

const cashItems: CashItem[] = [
  {
    cash_item_coloring_prism: {
      color_range: '검은색',
      hue: 0,
      saturation: 0,
      value: 0
    },
    cash_item_description: '',
    cash_item_equipment_part: '헤어',
    cash_item_equipment_slot: '헤어',
    cash_item_icon: '',
    cash_item_label: '',
    cash_item_name: '검은색 채운 헤어',
    cash_item_option: [],
    date_expire: '',
    date_option_expire: '',
    item_gender: ''
  },
  {
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
    item_gender: ''
  }
]

describe('generateCharacterNicknames', () => {
  it('캐릭터 데이터로 중복 없는 별명 5개를 만든다', () => {
    const nicknames = generateCharacterNicknames({
      basic,
      cashItems,
      equipment,
      style: 'random'
    })

    expect(nicknames).toHaveLength(5)
    expect(new Set(nicknames.map(nickname => nickname.title)).size).toBe(5)
    expect(nicknames.some(nickname => nickname.title.includes('아델'))).toBe(
      true
    )
    expect(
      nicknames.some(nickname => nickname.description.includes('제네시스 튜너'))
    ).toBe(true)
  })

  it('스타일을 선택하면 해당 분위기의 별명을 우선 생성한다', () => {
    const nicknames = generateCharacterNicknames({
      basic,
      cashItems,
      equipment,
      style: 'cute'
    })

    expect(nicknames[0].style).toBe('cute')
    expect(nicknames[0].title).toContain('므래')
  })
})
