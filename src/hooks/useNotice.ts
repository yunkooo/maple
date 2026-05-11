import { getNotice } from '@/api/character'
import { Notice, RequestStatus } from '@/api/character.types'
import { useEffect, useState } from 'react'

export function useNotice() {
  const [noticeData, setNoticeData] = useState<Notice[]>([])
  const [status, setStatus] = useState<RequestStatus>('idle')

  useEffect(() => {
    let ignore = false

    const fetchNoticeData = async () => {
      setStatus('loading')

      try {
        const noticeDataResponse = await getNotice()

        if (!ignore) {
          setNoticeData(noticeDataResponse.notice || [])
          setStatus('idle')
        }
      } catch {
        if (!ignore) {
          setNoticeData([])
          setStatus('error')
        }
      }
    }

    fetchNoticeData()

    return () => {
      ignore = true
    }
  }, [])

  return { noticeData, status }
}
