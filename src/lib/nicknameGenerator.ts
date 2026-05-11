import type { CashItem, CharacterBasic, Equipment } from '@/api/character.types'

export type NicknameStyle = 'random' | 'cool' | 'cute' | 'dark' | 'boss'

export type GeneratedNickname = {
  description: string
  style: NicknameStyle
  title: string
}

type NicknameInput = {
  basic: CharacterBasic
  cashItems: CashItem[]
  equipment: Equipment[]
  style: NicknameStyle
}

const styleLabels: Record<NicknameStyle, string> = {
  boss: '보스',
  cool: '멋짐',
  cute: '귀여움',
  dark: '중2병',
  random: '랜덤'
}

const getStarforce = (starforce?: string) =>
  Number.parseInt(starforce || '0', 10) || 0

const getTopStarEquipment = (equipment: Equipment[]) =>
  equipment.reduce<Equipment | undefined>((selectedEquipment, item) => {
    if (!selectedEquipment) {
      return item
    }

    return getStarforce(item.starforce) >
      getStarforce(selectedEquipment.starforce)
      ? item
      : selectedEquipment
  }, undefined)

const findCashItem = (cashItems: CashItem[], slots: string[]) =>
  cashItems.find(item => slots.includes(item.cash_item_equipment_slot))

const getColorMood = (cashItems: CashItem[]) => {
  const sourceText = cashItems
    .flatMap(item => [
      item.cash_item_name,
      item.cash_item_coloring_prism?.color_range
    ])
    .join(' ')

  if (/검|블랙|어둠|다크/i.test(sourceText)) {
    return '검은'
  }

  if (/핑크|분홍|체리|러블리/i.test(sourceText)) {
    return '분홍빛'
  }

  if (/파랑|블루|하늘|아쿠아/i.test(sourceText)) {
    return '푸른'
  }

  if (/금|골드|노랑|황금/i.test(sourceText)) {
    return '황금빛'
  }

  return '빛나는'
}

const getLevelTitle = (level: number) => {
  if (level >= 285) {
    return '최상위'
  }

  if (level >= 260) {
    return '그란디스'
  }

  if (level >= 200) {
    return '아케인'
  }

  return '성장 중인'
}

const uniqueNicknames = (nicknames: GeneratedNickname[]) => {
  const usedTitles = new Set<string>()

  return nicknames.filter(nickname => {
    if (usedTitles.has(nickname.title)) {
      return false
    }

    usedTitles.add(nickname.title)
    return true
  })
}

export function generateCharacterNicknames({
  basic,
  cashItems,
  equipment,
  style
}: NicknameInput): GeneratedNickname[] {
  const characterName = basic.character_name || '캐릭터'
  const characterClass = basic.character_class || '모험가'
  const levelTitle = getLevelTitle(basic.character_level || 0)
  const colorMood = getColorMood(cashItems)
  const topEquipment = getTopStarEquipment(equipment)
  const weapon = findCashItem(cashItems, ['무기'])?.cash_item_name
  const hair = findCashItem(cashItems, ['헤어'])?.cash_item_name
  const cape = findCashItem(cashItems, ['망토'])?.cash_item_name
  const starforce = getStarforce(topEquipment?.starforce)
  const topEquipmentName = topEquipment?.item_name || '대표 장비'
  const primaryStyle: NicknameStyle = style === 'random' ? 'cool' : style
  const templates: GeneratedNickname[] = [
    {
      description: `${topEquipmentName} 기준으로 만든 성장형 별명입니다.`,
      style: primaryStyle,
      title:
        primaryStyle === 'cute'
          ? `${characterName}, ${colorMood} 리본의 ${characterClass}`
          : `${colorMood} 검을 든 ${characterClass}`
    },
    {
      description: `${levelTitle} 성장 구간과 직업 정보를 조합했습니다.`,
      style: 'cool',
      title: `${levelTitle} ${characterClass} ${characterName}`
    },
    {
      description:
        starforce > 0
          ? `${starforce}성 ${topEquipmentName}에서 가져온 별명입니다.`
          : `${topEquipmentName} 정보를 기준으로 만든 별명입니다.`,
      style: 'boss',
      title: `${starforce || '준비된'}성의 ${characterClass} 사냥꾼`
    },
    {
      description: `${weapon || cape || '코디 아이템'} 코디 포인트를 반영했습니다.`,
      style: 'dark',
      title: `${weapon || cape || colorMood}의 그림자 ${characterName}`
    },
    {
      description: `${hair || '헤어'}와 캐시 코디 분위기를 반영했습니다.`,
      style: 'cute',
      title: `${colorMood} 무드의 ${characterName}`
    },
    {
      description: `${basic.world_name || '월드'}와 길드 정보를 살짝 섞었습니다.`,
      style: 'random',
      title: `${basic.character_guild_name || basic.world_name || '메이플'}의 ${characterClass}`
    }
  ]

  const sortedTemplates = [
    ...templates.filter(nickname => nickname.style === primaryStyle),
    ...templates.filter(nickname => nickname.style !== primaryStyle)
  ]

  return uniqueNicknames(sortedTemplates)
    .slice(0, 5)
    .map(nickname => ({
      ...nickname,
      style: style === 'random' ? nickname.style : nickname.style
    }))
}

export function getNicknameStyleLabel(style: NicknameStyle) {
  return styleLabels[style]
}
