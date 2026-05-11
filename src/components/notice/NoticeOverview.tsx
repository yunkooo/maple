import NoticeDashboard, {
  NoticeDashboardNotice,
  NoticeDashboardStatus
} from '@/components/notice/NoticeDashboard'
import { useNotices } from '@/hooks/useNotices'

const NEW_NOTICE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000

const formatPeriodDate = (value?: string) => {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value.includes('T') ? value.slice(0, 10).replace(/-/g, '.') : value
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}

const getNoticePeriod = (notice: {
  eventEndAt?: string
  eventStartAt?: string
  saleEndAt?: string
  saleStartAt?: string
}) => {
  if (notice.eventStartAt || notice.eventEndAt) {
    return {
      label: '이벤트 기간',
      text: `${formatPeriodDate(notice.eventStartAt)} ~ ${formatPeriodDate(notice.eventEndAt)}`
    }
  }

  if (notice.saleStartAt || notice.saleEndAt) {
    return {
      label: '판매 기간',
      text: `${formatPeriodDate(notice.saleStartAt)} ~ ${formatPeriodDate(notice.saleEndAt)}`
    }
  }

  return undefined
}

const getNoticeSummary = (notice: {
  eventEndAt?: string
  eventStartAt?: string
  isAlwaysOnSale?: boolean
  saleEndAt?: string
  saleStartAt?: string
  sourceLabel: string
}) => {
  if (
    notice.eventStartAt ||
    notice.eventEndAt ||
    notice.saleStartAt ||
    notice.saleEndAt
  ) {
    return undefined
  }

  if (notice.isAlwaysOnSale) {
    return '상시 판매 캐시샵 소식입니다.'
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
  const { errorMessage, notices, status: noticeStatus } = useNotices()
  const noticeDashboardStatus: NoticeDashboardStatus =
    noticeStatus === 'idle' ? 'success' : noticeStatus
  const dashboardNotices: NoticeDashboardNotice[] = notices.map(notice => {
    const period = getNoticePeriod(notice)

    return {
      category: notice.type,
      id: notice.id,
      isNew: isNewNotice(notice.date),
      periodLabel: period?.label,
      periodText: period?.text,
      publishedAt: notice.date,
      summary: getNoticeSummary(notice),
      title: notice.title,
      url: notice.url
    }
  })

  return (
    <NoticeDashboard
      errorMessage={errorMessage}
      notices={dashboardNotices}
      status={noticeDashboardStatus}
    />
  )
}
