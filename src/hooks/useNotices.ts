import { getDashboardNotices, NOTICE_REFRESH_POLICY_TEXT } from '@/api/notice'
import {
  DashboardNotice,
  NoticeRequestStatus,
  UseNoticesResult
} from '@/api/notice.types'
import { HTTPError } from 'ky'
import { useEffect, useState } from 'react'

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
  const [notices, setNotices] = useState<DashboardNotice[]>([])
  const [status, setStatus] = useState<NoticeRequestStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    const fetchNotices = async () => {
      setStatus('loading')
      setErrorMessage('')

      try {
        const response = await getDashboardNotices()

        if (!ignore) {
          setNotices(response.notices)
          setRefreshedAt(new Date().toISOString())
          setStatus('idle')
        }
      } catch (error) {
        if (!ignore) {
          setNotices([])
          setStatus('error')
          setErrorMessage(await getNoticeErrorMessage(error))
        }
      }
    }

    fetchNotices()

    return () => {
      ignore = true
    }
  }, [])

  return {
    errorMessage,
    notices,
    refreshPolicyText: NOTICE_REFRESH_POLICY_TEXT,
    refreshedAt,
    status
  }
}
