type CharacterNicknameStorage = Pick<Storage, 'getItem' | 'setItem'>

export const LAST_SUCCESSFUL_CHARACTER_NICKNAME_STORAGE_KEY =
  'maple:lastSuccessfulNickname'
export const LAST_SUCCESSFUL_CHARACTER_NICKNAME_EVENT =
  'maple:lastSuccessfulNicknameChange'

const getBrowserStorage = (): CharacterNicknameStorage | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  return window.localStorage
}

const notifyLastSuccessfulCharacterNicknameChange = (nickname: string) => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent(LAST_SUCCESSFUL_CHARACTER_NICKNAME_EVENT, {
      detail: { nickname }
    })
  )
}

export function getStoredLastSuccessfulCharacterNickname(
  storage = getBrowserStorage()
) {
  try {
    return (
      storage
        ?.getItem(LAST_SUCCESSFUL_CHARACTER_NICKNAME_STORAGE_KEY)
        ?.trim() || ''
    )
  } catch {
    return ''
  }
}

export function setStoredLastSuccessfulCharacterNickname(
  nickname: string,
  storage = getBrowserStorage()
) {
  const normalizedNickname = nickname.trim()

  if (!normalizedNickname) {
    return ''
  }

  try {
    storage?.setItem(
      LAST_SUCCESSFUL_CHARACTER_NICKNAME_STORAGE_KEY,
      normalizedNickname
    )
  } catch {
    // 검색 유지 기능은 저장소 접근이 막혀도 화면 동작을 방해하지 않습니다.
  }

  notifyLastSuccessfulCharacterNicknameChange(normalizedNickname)

  return normalizedNickname
}
