import NoticeDashboard, {
  NoticeDashboardNotice,
  NoticeDashboardStatus
} from '@/components/notice/NoticeDashboard'
import { useNotices } from '@/hooks/useNotices'

const NEW_NOTICE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000

const getNoticeSummary = (notice: {
  eventEndAt?: string
  eventStartAt?: string
  isAlwaysOnSale?: boolean
  saleEndAt?: string
  saleStartAt?: string
  sourceLabel: string
}) => {
  if (notice.eventStartAt || notice.eventEndAt) {
    return `이벤트 기간 ${notice.eventStartAt || '-'} ~ ${notice.eventEndAt || '-'}`
  }

  if (notice.isAlwaysOnSale) {
    return '상시 판매 캐시샵 소식입니다.'
  }

  if (notice.saleStartAt || notice.saleEndAt) {
    return `판매 기간 ${notice.saleStartAt || '-'} ~ ${notice.saleEndAt || '-'}`
  }

  return `${notice.sourceLabel} 최신 소식입니다.`
}

const isNewNotice = (date: string) => {
  const timestamp = Date.parse(date)

  if (Number.isNaN(timestamp)) {
    return false
  }

  return Date.now() - timestamp <= NEW_NOTICE_PERIOD_MS
}

export default function NoticeOverview() {
  const {
    errorMessage,
    notices,
    refreshedAt,
    refreshPolicyText,
    status: noticeStatus
  } = useNotices()
  const noticeDashboardStatus: NoticeDashboardStatus =
    noticeStatus === 'idle' ? 'success' : noticeStatus
  const dashboardNotices: NoticeDashboardNotice[] = notices.map(notice => ({
    category: notice.type,
    id: notice.id,
    isNew: isNewNotice(notice.date),
    publishedAt: notice.date,
    summary: getNoticeSummary(notice),
    title: notice.title,
    url: notice.url
  }))

  return (
    <NoticeDashboard
      errorMessage={errorMessage}
      notices={dashboardNotices}
      refreshedAt={refreshedAt}
      refreshPolicyText={refreshPolicyText}
      status={noticeDashboardStatus}
    />
  )
}
