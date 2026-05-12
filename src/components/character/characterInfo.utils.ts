import type { CharacterBasic, RequestStatus } from '@/api/character.types'

type CharacterFallbackInput = {
  basicData?: CharacterBasic
  basicStatus?: RequestStatus
  errorMessage?: string
  nickname?: string
  ocid?: string
  status: RequestStatus
}

type CharacterLookupPendingInput = {
  basicStatus?: RequestStatus
  nickname?: string
  ocid?: string
  status: RequestStatus
}

type SuccessfulCharacterNicknameInput = {
  basicData?: CharacterBasic
  basicStatus?: RequestStatus
  ocid?: string
  status: RequestStatus
}

export function shouldShowCharacterNotFoundFallback({
  basicData,
  basicStatus,
  errorMessage,
  nickname,
  ocid,
  status
}: CharacterFallbackInput) {
  const hasNickname = Boolean(nickname?.trim())

  if (!hasNickname || status === 'loading' || basicStatus === 'loading') {
    return false
  }

  if (status === 'error' || Boolean(errorMessage)) {
    return true
  }

  if (!ocid) {
    return true
  }

  if (basicStatus === 'error') {
    return true
  }

  if (basicData && !basicData.character_name?.trim()) {
    return true
  }

  return false
}

export function shouldShowCharacterLookupPending({
  basicStatus,
  nickname,
  ocid,
  status
}: CharacterLookupPendingInput) {
  const hasNickname = Boolean(nickname?.trim())

  if (!hasNickname) {
    return false
  }

  if (status === 'loading') {
    return true
  }

  return Boolean(ocid) && basicStatus === 'loading'
}

export function getSuccessfulCharacterNickname({
  basicData,
  basicStatus,
  ocid,
  status
}: SuccessfulCharacterNicknameInput) {
  if (
    !ocid ||
    status === 'loading' ||
    status === 'error' ||
    basicStatus === 'loading' ||
    basicStatus === 'error'
  ) {
    return ''
  }

  return basicData?.character_name?.trim() || ''
}
