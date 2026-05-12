import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useId,
  useRef,
  useState
} from 'react'
import type { CashItem } from '@/api/character.types'
import { HOVER_DETAILS_INTERACTIVE_VISIBILITY_CLASS } from '@/components/shared/hoverDetailsClassNames'
import { cn } from '@/lib/utils'
import {
  formatCashItemDate,
  getCashItemOptionRows,
  getCashItemPrismSummary
} from './cody.utils'

type CodyItemHoverDetailsProps = {
  children: ReactNode
  item?: CashItem | null
  panelClassName?: string
  slotLabel?: string
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>

const TOOLTIP_GAP = 8
const VIEWPORT_PADDING = 12

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const trimText = (value?: string | null) => value?.trim() || ''

export default function CodyItemHoverDetails({
  children,
  className,
  item,
  panelClassName,
  slotLabel,
  tabIndex,
  'aria-describedby': ariaDescribedBy,
  ...wrapperProps
}: CodyItemHoverDetailsProps) {
  const detailsId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>()
  const updatePanelPosition = useCallback(() => {
    const wrapperElement = wrapperRef.current
    const panelElement = panelRef.current

    if (!wrapperElement || !panelElement) {
      return
    }

    const triggerRect = wrapperElement.getBoundingClientRect()
    const panelWidth = panelElement.offsetWidth
    const panelHeight = panelElement.offsetHeight
    const maxLeft = Math.max(
      VIEWPORT_PADDING,
      window.innerWidth - panelWidth - VIEWPORT_PADDING
    )
    const maxTop = Math.max(
      VIEWPORT_PADDING,
      window.innerHeight - panelHeight - VIEWPORT_PADDING
    )
    const nextLeft = clamp(
      triggerRect.left + triggerRect.width / 2 - panelWidth / 2,
      VIEWPORT_PADDING,
      maxLeft
    )
    const belowTop = triggerRect.bottom + TOOLTIP_GAP
    const nextTop =
      belowTop + panelHeight + VIEWPORT_PADDING <= window.innerHeight
        ? belowTop
        : clamp(
            triggerRect.top - panelHeight - TOOLTIP_GAP,
            VIEWPORT_PADDING,
            maxTop
          )

    setPanelStyle({
      left: nextLeft,
      top: nextTop
    })
  }, [])

  if (!item) {
    return <>{children}</>
  }

  const itemName = item.cash_item_name || slotLabel || '이름 없는 코디 아이템'
  const itemIcon = item.cash_item_icon
  const itemLabel = trimText(item.cash_item_label)
  const itemDescription = trimText(item.cash_item_description)
  const genderLabel = trimText(item.item_gender)
  const partLabel =
    trimText(item.cash_item_equipment_part) ||
    trimText(item.cash_item_equipment_slot) ||
    slotLabel ||
    '코디 아이템'
  const slotInfo =
    trimText(item.cash_item_equipment_slot) &&
    trimText(item.cash_item_equipment_slot) !== partLabel
      ? trimText(item.cash_item_equipment_slot)
      : undefined
  const expireDateLabel = formatCashItemDate(item.date_expire)
  const optionExpireDateLabel = formatCashItemDate(item.date_option_expire)
  const prismSummary = getCashItemPrismSummary(item)
  const optionRows = getCashItemOptionRows(item)
  const describedBy = [ariaDescribedBy, detailsId].filter(Boolean).join(' ')
  const hasDetailSections =
    Boolean(prismSummary) || optionRows.length > 0 || Boolean(itemDescription)

  return (
    <div
      {...wrapperProps}
      ref={wrapperRef}
      aria-describedby={describedBy}
      className={cn(
        'group relative block max-w-full rounded-lg align-top outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
      onClick={updatePanelPosition}
      onFocus={updatePanelPosition}
      onMouseEnter={updatePanelPosition}
      tabIndex={tabIndex ?? 0}>
      {children}
      <div
        ref={panelRef}
        id={detailsId}
        role="tooltip"
        style={panelStyle}
        className={cn(
          'pointer-events-none invisible fixed z-[70] w-[min(23rem,calc(100vw-1rem))] overflow-visible rounded-lg border border-white/80 bg-neutral-950/95 p-3 text-left text-white opacity-0 shadow-2xl shadow-black/60 backdrop-blur-md transition duration-150 max-sm:w-[calc(100vw-1rem)]',
          HOVER_DETAILS_INTERACTIVE_VISIBILITY_CLASS,
          panelClassName
        )}>
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent_34%)]" />
        <div className="relative space-y-2">
          <header className="space-y-1 border-b border-dashed border-white/35 pb-2 text-center">
            {itemLabel && (
              <p className="text-xs font-black text-fuchsia-200">{itemLabel}</p>
            )}
            <h2 className="break-words text-base font-black leading-snug text-white">
              {itemName}
            </h2>
            {expireDateLabel && (
              <p className="text-xs font-black text-orange-300">
                유효 기간 : {expireDateLabel}
              </p>
            )}
            {optionExpireDateLabel && (
              <p className="text-xs font-black text-amber-200">
                옵션 유효 기간 : {optionExpireDateLabel}
              </p>
            )}
          </header>

          <div className="grid grid-cols-[3.75rem_1fr] gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-pink-300 bg-white shadow-inner">
              {itemIcon ? (
                <img
                  className="h-10 w-10 object-contain [image-rendering:pixelated]"
                  src={itemIcon}
                  alt=""
                />
              ) : (
                <span className="text-xs font-black text-neutral-500">
                  CODI
                </span>
              )}
            </div>
            <div className="space-y-1 self-end text-xs font-black leading-5 text-white">
              <p>코디분류 : {partLabel}</p>
              {slotInfo && (
                <p className="text-white/80">착용 슬롯 : {slotInfo}</p>
              )}
              {genderLabel && (
                <p className="text-white/80">착용 성별 : {genderLabel}</p>
              )}
            </div>
          </div>

          {prismSummary && (
            <section className="space-y-1.5 border-t border-dashed border-white/35 pt-2">
              <h3 className="text-xs font-black text-pink-200">컬러프리즘</h3>
              <p className="text-xs font-black leading-5 text-white">
                {prismSummary.colorRange}
              </p>
              <p className="text-xs font-bold leading-5 text-white/75">
                {prismSummary.values}
              </p>
            </section>
          )}

          {optionRows.length > 0 && (
            <section className="space-y-1.5 border-t border-dashed border-white/35 pt-2">
              <h3 className="text-xs font-black text-cyan-200">능력치 옵션</h3>
              <dl className="space-y-1">
                {optionRows.map(option => (
                  <div
                    key={`${option.label}-${option.value}`}
                    className="flex flex-wrap items-baseline gap-x-1.5 text-xs font-black leading-5">
                    <dt className="text-cyan-200">{option.label} :</dt>
                    <dd className="text-white">{option.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {itemDescription && (
            <section className="border-t border-dashed border-white/35 pt-2">
              <p className="text-xs font-bold leading-5 text-white">
                {itemDescription}
              </p>
            </section>
          )}

          {!hasDetailSections && (
            <p className="border-t border-dashed border-white/35 pt-2 text-xs font-bold leading-5 text-white/60">
              표시할 추가 옵션 정보가 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
