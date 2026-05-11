import { type PetEquipmentItem } from '@/api/character.types'
import { cn } from '@/lib/utils'
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useId,
  useRef,
  useState
} from 'react'

type PetEquipmentHoverDetailsProps = {
  children: ReactNode
  item?: PetEquipmentItem | null
  panelClassName?: string
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>

const TOOLTIP_GAP = 8
const VIEWPORT_PADDING = 12

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export default function PetEquipmentHoverDetails({
  children,
  className,
  item,
  panelClassName,
  tabIndex,
  'aria-describedby': ariaDescribedBy,
  ...wrapperProps
}: PetEquipmentHoverDetailsProps) {
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

  const itemIcon = item.item_shape_icon || item.item_icon
  const itemName = item.item_name || '펫 장비'
  const itemDescription = item.item_description?.trim()
  const itemOptions = item.item_option || []
  const describedBy = [ariaDescribedBy, detailsId].filter(Boolean).join(' ')

  return (
    <div
      {...wrapperProps}
      ref={wrapperRef}
      aria-describedby={describedBy}
      className={cn(
        'group relative inline-block max-w-full rounded-lg align-top outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
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
          'pointer-events-none invisible fixed z-[70] w-[min(21rem,calc(100vw-1rem))] overflow-visible rounded-lg border border-white/80 bg-neutral-950/95 p-3 text-left text-white opacity-0 shadow-2xl shadow-black/60 backdrop-blur-md transition duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100 max-sm:w-[calc(100vw-1rem)]',
          panelClassName
        )}>
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent_34%)]" />
        <div className="relative space-y-2">
          <header className="border-b border-dashed border-white/35 pb-2 text-center">
            <h2 className="break-words text-base font-black leading-snug text-white">
              {itemName}
            </h2>
            <p className="text-xs font-black text-white/70">펫 장비</p>
          </header>

          <div className="grid grid-cols-[3.75rem_1fr] gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-yellow-400 bg-white shadow-inner">
              {itemIcon ? (
                <img
                  className="h-10 w-10 object-contain [image-rendering:pixelated]"
                  src={itemIcon}
                  alt=""
                />
              ) : (
                <span className="text-xs font-black text-neutral-500">PET</span>
              )}
            </div>
            <div className="space-y-1 self-end text-xs font-black leading-5 text-white">
              {item.item_shape && (
                <p className="text-white/80">외형 : {item.item_shape}</p>
              )}
            </div>
          </div>

          {(itemDescription || itemOptions.length > 0) && (
            <section className="space-y-1.5 border-t border-dashed border-white/35 pt-2">
              {itemDescription && (
                <p className="text-xs font-bold leading-5 text-white">
                  {itemDescription}
                </p>
              )}
              {itemOptions.length > 0 && (
                <div className="space-y-1 text-xs font-black leading-5 text-yellow-300">
                  {itemOptions.map(option => (
                    <p key={`${option.option_type}-${option.option_value}`}>
                      {option.option_type} {option.option_value}
                    </p>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
