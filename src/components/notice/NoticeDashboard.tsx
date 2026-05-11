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
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'

export type NoticeDashboardCategory = 'notice' | 'update' | 'event' | 'cashshop'

export type NoticeDashboardStatus = 'idle' | 'loading' | 'success' | 'error'

export type NoticeDashboardNotice = {
  category: NoticeDashboardCategory
  id?: string | number
  isNew?: boolean
  periodLabel?: string
  periodText?: string
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

const LIST_CATEGORY_ORDER: NoticeDashboardCategory[] = ['notice', 'update']

const SLIDER_CATEGORY_ORDER: NoticeDashboardCategory[] = ['event', 'cashshop']

const SLIDER_ROW_COUNT = 2

const COLLAPSED_NOTICE_COUNT = 10

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

const getCategoryNotices = (
  notices: NoticeDashboardNotice[],
  category: NoticeDashboardCategory
) => notices.filter(notice => notice.category === category)

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
      <div className="grid gap-4 xl:grid-cols-2">
        {[...SLIDER_CATEGORY_ORDER, ...LIST_CATEGORY_ORDER].map(category => (
          <div
            key={category}
            className="rounded-lg border border-border bg-background/70 p-4 dark:bg-white/5">
            <div className="h-6 w-28 animate-pulse rounded bg-muted" />
            <div className="mt-5 space-y-3">
              <div className="h-16 animate-pulse rounded bg-muted/80" />
              <div className="h-16 animate-pulse rounded bg-muted/80" />
              <div className="h-16 animate-pulse rounded bg-muted/80" />
            </div>
          </div>
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

function NoticeListItem({ notice }: { notice: NoticeDashboardNotice }) {
  const publishedAt = formatDisplayDate(notice.publishedAt)

  return (
    <li className="group border-b border-border/80 px-4 py-3 last:border-b-0 transition hover:bg-muted/45 dark:hover:bg-white/[0.04]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {notice.isNew && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-black text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
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
          <p className="mt-2 line-clamp-2 text-sm font-black leading-5 text-foreground">
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
    </li>
  )
}

function EventNoticeCard({ notice }: { notice: NoticeDashboardNotice }) {
  const meta = CATEGORY_META[notice.category]

  return (
    <article className="flex min-h-[190px] w-[min(82vw,320px)] shrink-0 snap-start flex-col rounded-lg border border-border bg-background/80 p-4 shadow-sm outline-none transition hover:border-emerald-300 hover:shadow-md hover:ring-2 hover:ring-emerald-300/70 dark:bg-white/[0.055] dark:hover:border-emerald-400/50 dark:hover:ring-emerald-400/40 sm:w-[320px]">
      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge category={notice.category} />
        {notice.isNew && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-black text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
            NEW
          </span>
        )}
      </div>
      <div className={`mt-4 h-1 w-12 rounded-full ${meta.accentClass}`} />
      <h4 className="mt-3 line-clamp-2 text-base font-black leading-6 text-foreground">
        {notice.title}
      </h4>
      {notice.periodLabel && notice.periodText ? (
        <div className="mt-2 space-y-1 text-sm leading-6 text-muted-foreground">
          <p className="font-bold text-muted-foreground">
            {notice.periodLabel}
          </p>
          <p className="line-clamp-1 whitespace-nowrap text-foreground/80">
            {notice.periodText}
          </p>
        </div>
      ) : notice.summary ? (
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {notice.summary}
        </p>
      ) : null}
      <div className="mt-auto flex justify-end pt-4">
        <NoticeExternalLink
          title={notice.title}
          url={notice.url}
        />
      </div>
    </article>
  )
}

function NoticeSliderSection({
  category,
  notices
}: {
  category: NoticeDashboardCategory
  notices: NoticeDashboardNotice[]
}) {
  const meta = CATEGORY_META[category]
  const Icon = meta.icon
  const sliderRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef({
    hasMoved: false,
    isDragging: false,
    scrollLeft: 0,
    startX: 0
  })
  const suppressClickRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const sliderColumnCount = Math.ceil(notices.length / SLIDER_ROW_COUNT)

  const getColumnScrollLeft = (index: number) => {
    const slider = sliderRef.current
    const targetCard = slider?.children[index * SLIDER_ROW_COUNT] as
      | HTMLElement
      | undefined

    if (!slider || !targetCard) {
      return 0
    }

    return Math.min(
      targetCard.offsetLeft - slider.offsetLeft,
      slider.scrollWidth - slider.clientWidth
    )
  }

  const getSliderIndex = () => {
    const slider = sliderRef.current

    if (!slider || notices.length <= 1) {
      return 0
    }

    return Array.from({ length: sliderColumnCount }).reduce<number>(
      (closestIndex, _, index) => {
        const targetScrollLeft = getColumnScrollLeft(index)
        const closestScrollLeft = getColumnScrollLeft(closestIndex)

        return Math.abs(slider.scrollLeft - targetScrollLeft) <
          Math.abs(slider.scrollLeft - closestScrollLeft)
          ? index
          : closestIndex
      },
      0
    )
  }

  const scrollToNotice = (index: number) => {
    const slider = sliderRef.current

    if (!slider) {
      return
    }

    slider.scrollTo({
      behavior: 'smooth',
      left: getColumnScrollLeft(index)
    })
  }

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }

    const slider = sliderRef.current

    if (!slider) {
      return
    }

    dragStateRef.current = {
      hasMoved: false,
      isDragging: true,
      scrollLeft: slider.scrollLeft,
      startX: event.clientX
    }
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging) {
      return
    }

    const handleMouseMove = (event: MouseEvent) => {
      const slider = sliderRef.current
      const dragState = dragStateRef.current

      if (!slider || !dragState.isDragging) {
        return
      }

      const moveDistance = event.clientX - dragState.startX

      if (Math.abs(moveDistance) > 4) {
        dragState.hasMoved = true
      }

      slider.scrollLeft = dragState.scrollLeft - moveDistance
      event.preventDefault()
    }

    const handleMouseUp = () => {
      endDrag()
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const endDrag = () => {
    const slider = sliderRef.current
    const dragState = dragStateRef.current

    if (!slider || !dragState.isDragging) {
      return
    }

    if (dragState.hasMoved) {
      suppressClickRef.current = true
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 0)

      window.requestAnimationFrame(() => {
        scrollToNotice(getSliderIndex())
      })
    }

    dragState.isDragging = false
    setIsDragging(false)
  }

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <section className="rounded-lg border border-border bg-background/70 p-4 shadow-sm dark:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={category} />
            <span className="rounded-full bg-background px-2.5 py-1 text-xs font-black text-foreground shadow-sm dark:bg-white/10">
              {notices.length}건
            </span>
          </div>
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${meta.badgeClass}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>

      {notices.length > 0 ? (
        <>
          <div
            ref={sliderRef}
            className={`mt-3 grid select-none auto-cols-[min(82vw,320px)] grid-flow-col grid-rows-2 gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 py-1 [scrollbar-width:none] [touch-action:pan-y] [&::-webkit-scrollbar]:hidden sm:auto-cols-[320px] ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onClickCapture={handleClickCapture}
            onMouseDown={handleMouseDown}>
            {notices.map((notice, index) => (
              <EventNoticeCard
                key={getNoticeKey(notice, index)}
                notice={notice}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-background/70 px-4 py-10 text-center dark:bg-white/5">
          <p className="text-sm font-bold text-muted-foreground">
            표시할 {meta.label} 소식이 없습니다.
          </p>
        </div>
      )}
    </section>
  )
}

function NoticeCategorySection({
  category,
  notices
}: {
  category: NoticeDashboardCategory
  notices: NoticeDashboardNotice[]
}) {
  const meta = CATEGORY_META[category]
  const Icon = meta.icon
  const latestDate = formatDisplayDate(notices[0]?.publishedAt)
  const [isExpanded, setIsExpanded] = useState(false)
  const hasHiddenNotices = notices.length > COLLAPSED_NOTICE_COUNT
  const visibleNotices = notices.slice(0, COLLAPSED_NOTICE_COUNT)
  const hiddenNotices = notices.slice(COLLAPSED_NOTICE_COUNT)

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background/70 shadow-sm dark:bg-white/5">
      <div className={`h-1 ${meta.accentClass}`} />
      <header className="border-b border-border bg-muted/30 p-4 dark:bg-white/[0.04]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={category} />
              <span className="rounded-full bg-background px-2.5 py-1 text-xs font-black text-foreground shadow-sm dark:bg-white/10">
                {notices.length}건
              </span>
            </div>
            <h3 className="mt-3 text-lg font-black tracking-normal text-foreground">
              {meta.label} 모아보기
            </h3>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              {meta.description}
              {latestDate ? ` · 최신 ${latestDate}` : ''}
            </p>
          </div>
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${meta.badgeClass}`}>
            <Icon className="h-5 w-5" />
          </span>
        </div>
      </header>

      {notices.length > 0 ? (
        <>
          <ul className="flex-1">
            {visibleNotices.map((notice, index) => (
              <NoticeListItem
                key={getNoticeKey(notice, index)}
                notice={notice}
              />
            ))}
          </ul>
          {hasHiddenNotices && (
            <div
              className={`overflow-hidden transition-all duration-500 ease-out ${
                isExpanded ? 'max-h-[2200px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
              <ul
                className={`transition-transform duration-500 ease-out ${
                  isExpanded ? 'translate-y-0' : '-translate-y-3'
                }`}>
                {hiddenNotices.map((notice, index) => (
                  <NoticeListItem
                    key={getNoticeKey(notice, index + COLLAPSED_NOTICE_COUNT)}
                    notice={notice}
                  />
                ))}
              </ul>
            </div>
          )}
          {hasHiddenNotices && (
            <div className="border-t border-border bg-background/80 p-4 text-center dark:bg-white/[0.035]">
              <button
                type="button"
                aria-label={
                  isExpanded ? `${meta.label} 접기` : `${meta.label} 더보기`
                }
                className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-card px-4 text-sm font-bold text-foreground shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-white/5 dark:hover:border-emerald-400/50 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-200"
                onClick={() => setIsExpanded(currentValue => !currentValue)}>
                {isExpanded ? '접기' : '더보기'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="px-4 py-8 text-center">
          <p className="text-sm font-bold text-muted-foreground">
            표시할 {meta.label} 소식이 없습니다.
          </p>
        </div>
      )}
    </section>
  )
}

export default function NoticeDashboard({
  errorMessage,
  notices = [],
  refreshedAt,
  refreshPolicyText = '공지 데이터는 캐시 상태에 따라 주기적으로 갱신됩니다.',
  status = 'success'
}: NoticeDashboardProps) {
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
            <div className="space-y-4">
              {SLIDER_CATEGORY_ORDER.map(category => (
                <NoticeSliderSection
                  key={category}
                  category={category}
                  notices={getCategoryNotices(notices, category)}
                />
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {LIST_CATEGORY_ORDER.map(category => (
                <NoticeCategorySection
                  key={category}
                  category={category}
                  notices={getCategoryNotices(notices, category)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
