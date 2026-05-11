import { useNotice } from '@/hooks/useNotice'
import { Bell, ExternalLink } from 'lucide-react'

const loadingNoticeItems = [
  'notice-loading-1',
  'notice-loading-2',
  'notice-loading-3'
]

export default function NoticeSection() {
  const { noticeData, status } = useNotice()

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-black">공지사항</h2>
          <p className="text-sm text-muted-foreground">
            메이플스토리 최신 공지 흐름을 확인합니다.
          </p>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {status === 'loading'
            ? '조회중'
            : status === 'error'
              ? '조회 실패'
              : `${noticeData.length}개 공지`}
        </span>
      </header>

      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        {status === 'loading' ? (
          loadingNoticeItems.map(item => (
            <li
              className="space-y-2 p-4"
              key={item}>
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </li>
          ))
        ) : status === 'error' ? (
          <li className="bg-destructive/10 p-4 text-sm font-medium text-destructive">
            공지사항을 불러오지 못했습니다.
          </li>
        ) : noticeData.length > 0 ? (
          noticeData.map(notice => (
            <li key={notice.notice_id}>
              <a
                className="flex items-start gap-3 p-4 transition-colors hover:bg-accent"
                href={notice.url}
                target="_blank"
                rel="noreferrer">
                <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                  <Bell className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 space-y-1">
                  <span className="block break-keep text-sm font-bold leading-6 text-foreground">
                    {notice.title}
                  </span>
                  <span className="block text-xs font-medium text-muted-foreground">
                    {notice.date}
                  </span>
                </span>
                <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
              </a>
            </li>
          ))
        ) : (
          <li className="p-4 text-sm font-medium text-muted-foreground">
            표시할 공지사항이 없습니다.
          </li>
        )}
      </ul>
    </section>
  )
}
