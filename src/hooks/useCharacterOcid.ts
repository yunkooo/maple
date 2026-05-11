import { getOcid } from '@/api/character'
import { RequestStatus } from '@/api/character.types'
import { queryCacheTime } from '@/lib/queryCache'
import { useQuery } from '@tanstack/react-query'
import { HTTPError } from 'ky'

type MapleApiErrorBody = {
  error?: {
    message?: string
    name?: string
  }
}

async function getCharacterLookupErrorMessage(error: unknown) {
  if (!(error instanceof HTTPError)) {
    return '캐릭터를 찾지 못했습니다. 닉네임을 확인해주세요.'
  }

  const responseBody = await error.response
    .json()
    .then(body => body as MapleApiErrorBody)
    .catch(() => undefined)

  if (responseBody?.error?.name === 'LOCAL_CONFIG_MISSING_NEXON_API_KEY') {
    return 'NEXON_API_KEY가 설정되지 않았습니다. .env에 Nexon Open API 키를 입력한 뒤 개발 서버를 다시 실행해주세요.'
  }

  if (responseBody?.error?.name) {
    return `캐릭터 조회에 실패했습니다. (${responseBody.error.name})`
  }

  return '캐릭터를 찾지 못했습니다. 닉네임을 확인해주세요.'
}

export function useCharacterOcid(nickname: string | undefined) {
  const normalizedNickname = nickname?.trim()
  const query = useQuery({
    enabled: Boolean(normalizedNickname),
    queryFn: async () => {
      try {
        const response = await getOcid(normalizedNickname || '')
        return response.ocid
      } catch (error) {
        throw new Error(await getCharacterLookupErrorMessage(error))
      }
    },
    gcTime: queryCacheTime.ocid.gcTime,
    queryKey: ['character', 'ocid', normalizedNickname],
    staleTime: queryCacheTime.ocid.staleTime
  })
  const status: RequestStatus = !normalizedNickname
    ? 'idle'
    : query.isLoading
      ? 'loading'
      : query.isError
        ? 'error'
        : 'idle'
  const errorMessage = query.error instanceof Error ? query.error.message : ''

  return { errorMessage, ocid: query.data, status }
}
