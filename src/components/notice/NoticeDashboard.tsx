import {
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  Megaphone,
  PackageOpen,
  RefreshCw,
  Sparkles,
  Store,
  Wrench
} from 'lucide-react'

export type NoticeDashboardCategory = 'notice' | 'update' | 'event' | 'cashshop'

export type NoticeDashboardStatus = 'idle' | 'loading' | 'success' | 'error'

export type NoticeDashboardNotice = {
  category: NoticeDashboardCategory
  id?: string | number
  isNew?: boolean
  publishedAt?: Date | string | null
  summary?: string
  title: string
  url?: string
}

export type NoticeDashboardProps = {
  errorMessage?: string
  notices?: NoticeDashboardNotice[]
  refreshedAt?: Date | string | null
  refreshPolicyText?: string
  status?: NoticeDashboardStatus
}

const CATEGORY_META: Record<
  NoticeDashboardCategory,
  {
    accentClass: string
    badgeClass: string
    description: string
    icon: typeof Megaphone
    label: string
  }
> = {
  notice: {
    accentClass: 'bg-sky-500',
    badgeClass:
      'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-200',
    description: '운영 공지',
    icon: Megaphone,
    label: '공지'
  },
  update: {
    accentClass: 'bg-emerald-500',
    badgeClass:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200',
    description: '패치와 점검',
    icon: Wrench,
    label: '업데이트'
  },
  event: {
    accentClass: 'bg-amber-500',
    badgeClass:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-200',
    description: '진행 이벤트',
    icon: Sparkles,
    label: '이벤트'
  },
  cashshop: {
    accentClass: 'bg-rose-500',
    badgeClass:
      'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-200',
    description: '캐시샵 소식',
    icon: Store,
    label: '캐시샵'
  }
}

const CATEGORY_ORDER: NoticeDashboardCategory[] = [
  'notice',
  'update',
  'event',
  'cashshop'
]

const formatDisplayDate = (value?: Date | string | null) => {
  if (!value) {
    return undefined
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? undefined
      : value.toLocaleDateString('ko-KR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
  }

  return value.includes('T') ? value.split('T')[0] : value
}

const getNoticeKey = (notice: NoticeDashboardNotice, index: number) =>
  notice.id ?? `${notice.category}-${notice.title}-${index}`

const getCategoryCount = (
  notices: NoticeDashboardNotice[],
  category: NoticeDashboardCategory
) => notices.filter(notice => notice.category === category).length

function CategoryBadge({ category }: { category: NoticeDashboardCategory }) {
  const meta = CATEGORY_META[category]
  const Icon = meta.icon

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${meta.badgeClass}`}>
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  )
}

function NoticeExternalLink({ title, url }: { title: string; url?: string }) {
  if (!url) {
    return (
      <span className="inline-flex h-9 items-center rounded-md border border-border bg-muted/60 px-3 text-xs font-bold text-muted-foreground">
        링크 준비중
      </span>
    )
  }

  return (
    <a
      className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-background px-3 text-xs font-bold text-foreground transition hover:border-emerald-300 hover:text-emerald-700 dark:bg-white/5 dark:hover:border-emerald-400/50 dark:hover:text-emerald-200"
      href={url}
      rel="noreferrer"
      target="_blank"
      aria-label={`${title} 외부 링크 열기`}>
      바로가기
      <ArrowUpRight className="h-3.5 w-3.5" />
    </a>
  )
}

function NoticeSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-background/70 p-4 dark:bg-white/5">
        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-7 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {CATEGORY_ORDER.map(category => (
          <div
            key={category}
            className="h-24 animate-pulse rounded-lg border border-border bg-muted/60"
          />
        ))}
      </div>
    </div>
  )
}

function NoticeState({
  description,
  title,
  tone
}: {
  description: string
  title: string
  tone: 'empty' | 'error'
}) {
  const Icon = tone === 'error' ? AlertCircle : PackageOpen
  const iconClass =
    tone === 'error'
      ? 'bg-red-50 text-red-600 dark:bg-red-400/10 dark:text-red-200'
      : 'bg-muted text-muted-foreground'

  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background/70 p-6 text-center dark:bg-white/5">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${iconClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-4 text-base font-black text-foreground">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function LatestNoticeCard({ notice }: { notice: NoticeDashboardNotice }) {
  const publishedAt = formatDisplayDate(notice.publishedAt)

  return (
    <article className="rounded-lg border border-border bg-background/80 p-4 shadow-sm dark:bg-white/5">
      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge category={notice.category} />
        {notice.isNew && (
          <span className="rounded-full bg-foreground px-2.5 py-1 text-xs font-black text-background">
            NEW
          </span>
        )}
        {publishedAt && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {publishedAt}
          </span>
        )}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-normal text-emerald-600 dark:text-emerald-300">
            최신 소식
          </p>
          <h3 className="mt-1 line-clamp-2 text-2xl font-black text-foreground">
            {notice.title}
          </h3>
          {notice.summary && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {notice.summary}
            </p>
          )}
        </div>
        <NoticeExternalLink
          title={notice.title}
          url={notice.url}
        />
      </div>
    </article>
  )
}

function NoticeListItem({ notice }: { notice: NoticeDashboardNotice }) {
  const publishedAt = formatDisplayDate(notice.publishedAt)
  const categoryMeta = CATEGORY_META[notice.category]

  return (
    <li className="rounded-lg border border-border bg-background/70 p-3 transition hover:border-emerald-300/80 dark:bg-white/5 dark:hover:border-emerald-400/40">
      <div className="flex gap-3">
        <span
          className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${categoryMeta.accentClass}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={notice.category} />
            {notice.isNew && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-black text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
                NEW
              </span>
            )}
            {publishedAt && (
              <span className="text-xs font-medium text-muted-foreground">
                {publishedAt}
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-foreground">
                {notice.title}
              </p>
              {notice.summary && (
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {notice.summary}
                </p>
              )}
            </div>
            <NoticeExternalLink
              title={notice.title}
              url={notice.url}
            />
          </div>
        </div>
      </div>
    </li>
  )
}

export default function NoticeDashboard({
  errorMessage,
  notices = [],
  refreshedAt,
  refreshPolicyText = '공지 데이터는 캐시 상태에 따라 주기적으로 갱신됩니다.',
  status = 'success'
}: NoticeDashboardProps) {
  const latestNotice = notices[0]
  const refreshedAtText = formatDisplayDate(refreshedAt)

  return (
    <section
      className="rounded-lg border border-border bg-card p-4 shadow-sm md:p-5"
      aria-busy={status === 'loading'}>
      <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
            <Megaphone className="h-3.5 w-3.5" />
            메이플스토리 소식
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-normal text-foreground">
            공지/이벤트 대시보드
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            공지, 업데이트, 이벤트, 캐시샵 소식을 한 번에 확인할 수 있습니다.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background/70 p-3 text-xs text-muted-foreground dark:bg-white/5 md:min-w-[220px]">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <RefreshCw className="h-3.5 w-3.5" />
            갱신 정보
          </div>
          <p className="mt-2 leading-5">{refreshPolicyText}</p>
          <p className="mt-2 font-semibold">
            최근 갱신 {refreshedAtText || '-'}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {status === 'loading' ? (
          <NoticeSkeleton />
        ) : status === 'error' ? (
          <NoticeState
            tone="error"
            title="소식을 불러오지 못했습니다"
            description={
              errorMessage ||
              '잠시 후 다시 시도하거나 이전에 불러온 캐시 데이터를 확인해주세요.'
            }
          />
        ) : notices.length === 0 ? (
          <NoticeState
            tone="empty"
            title="표시할 소식이 없습니다"
            description="현재 조건에 맞는 공지, 업데이트, 이벤트, 캐시샵 소식이 없습니다."
          />
        ) : (
          <div className="space-y-5">
            {latestNotice && <LatestNoticeCard notice={latestNotice} />}

            <div className="grid gap-3 md:grid-cols-4">
              {CATEGORY_ORDER.map(category => {
                const meta = CATEGORY_META[category]
                const Icon = meta.icon
                const count = getCategoryCount(notices, category)

                return (
                  <div
                    key={category}
                    className="rounded-lg border border-border bg-background/70 p-3 dark:bg-white/5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-md ${meta.badgeClass}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-xl font-black text-foreground">
                        {count}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-black text-foreground">
                      {meta.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {meta.description}
                    </p>
                  </div>
                )
              })}
            </div>

            <ul className="grid gap-3 lg:grid-cols-2">
              {notices.map((notice, index) => (
                <NoticeListItem
                  key={getNoticeKey(notice, index)}
                  notice={notice}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
