import { getDashboardNotices } from '@/api/notice'
import {
  DashboardNotice,
  NoticeRequestStatus,
  UseNoticesResult
} from '@/api/notice.types'
import { queryCacheTime } from '@/lib/queryCache'
import { useQuery } from '@tanstack/react-query'
import { HTTPError } from 'ky'

type MapleApiErrorBody = {
  error?: {
    message?: string
    name?: string
  }
}

const getNoticeErrorMessage = async (error: unknown) => {
  if (!(error instanceof HTTPError)) {
    return '공지 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
  }

  const responseBody = await error.response
    .json()
    .then(body => body as MapleApiErrorBody)
    .catch(() => undefined)

  if (responseBody?.error?.name === 'LOCAL_CONFIG_MISSING_NEXON_API_KEY') {
    return 'NEXON_API_KEY가 설정되지 않았습니다. .env에 Nexon Open API 키를 입력한 뒤 개발 서버를 다시 실행해주세요.'
  }

  if (responseBody?.error?.name) {
    return `공지 목록 조회에 실패했습니다. (${responseBody.error.name})`
  }

  return '공지 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
}

export function useNotices(): UseNoticesResult {
  const query = useQuery({
    gcTime: queryCacheTime.notices.gcTime,
    queryFn: async () => {
      try {
        return await getDashboardNotices()
      } catch (error) {
        throw new Error(await getNoticeErrorMessage(error))
      }
    },
    queryKey: ['notices', 'dashboard'],
    staleTime: queryCacheTime.notices.staleTime
  })
  const status: NoticeRequestStatus = query.isLoading
    ? 'loading'
    : query.isError
      ? 'error'
      : 'idle'
  const errorMessage = query.error instanceof Error ? query.error.message : ''
  const notices: DashboardNotice[] = query.data?.notices ?? []

  return {
    errorMessage,
    notices,
    status
  }
}
