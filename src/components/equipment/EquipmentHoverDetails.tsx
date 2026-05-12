import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useId,
  useRef,
  useState
} from 'react'
import { type Equipment, type EquipmentOption } from '@/api/character.types'
import { cn } from '@/lib/utils'
import { HOVER_DETAILS_INTERACTIVE_VISIBILITY_CLASS } from '@/components/shared/hoverDetailsClassNames'

type EquipmentHoverDetailsProps = {
  children: ReactNode
  item?: Equipment | null
  panelClassName?: string
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>

type OptionKey = keyof EquipmentOption

type OptionPart = {
  className: string
  key: string
  value?: number | string
}

type StatRow = {
  key: OptionKey
  label: string
  parts: OptionPart[]
  total: string
}

const OPTION_LABELS: Partial<Record<OptionKey, string>> = {
  all_stat: '올스탯',
  armor: '방어력',
  attack_power: '공격력',
  base_equipment_level: '착용 레벨',
  boss_damage: '보공',
  damage: '데미지',
  dex: 'DEX',
  equipment_level_decrease: '착용 레벨 감소',
  exceptional_upgrade: '익셉셔널',
  ignore_monster_armor: '방무',
  int: 'INT',
  jump: '점프력',
  luk: 'LUK',
  magic_power: '마력',
  max_hp: 'HP',
  max_hp_rate: 'HP',
  max_mp: 'MP',
  max_mp_rate: 'MP',
  speed: '이동속도',
  str: 'STR'
}

const RATE_OPTION_KEYS: OptionKey[] = [
  'all_stat',
  'boss_damage',
  'damage',
  'ignore_monster_armor',
  'max_hp_rate',
  'max_mp_rate'
]

const STAT_OPTION_KEYS: OptionKey[] = [
  'str',
  'dex',
  'int',
  'luk',
  'max_hp',
  'max_mp',
  'attack_power',
  'magic_power',
  'boss_damage',
  'ignore_monster_armor',
  'damage',
  'all_stat',
  'armor',
  'speed',
  'jump'
]

const TOOLTIP_GAP = 8
const VIEWPORT_PADDING = 12

const GRADE_BADGE_LABEL: Record<string, string> = {
  레전드리: 'L',
  유니크: 'U',
  에픽: 'E',
  레어: 'R'
}

const GRADE_TEXT_CLASS: Record<string, string> = {
  레전드리: 'border-emerald-300 text-emerald-200',
  유니크: 'border-yellow-300 text-yellow-200',
  에픽: 'border-fuchsia-300 text-fuchsia-200',
  레어: 'border-sky-300 text-sky-200'
}

const isMeaningfulOption = (value: number | string | undefined) => {
  if (value === undefined) {
    return false
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  const trimmedValue = value.trim()

  return (
    trimmedValue !== '' &&
    trimmedValue !== '0' &&
    trimmedValue !== '+0' &&
    trimmedValue !== '0%' &&
    trimmedValue !== '+0%'
  )
}

const hasOptionValue = (value: number | string | undefined) =>
  value !== undefined && value !== ''

const formatSignedValue = (
  key: OptionKey,
  value: number | string | undefined
) => {
  if (!hasOptionValue(value)) {
    return undefined
  }

  const optionValue = String(value).trim()
  const suffix =
    RATE_OPTION_KEYS.includes(key) && !optionValue.includes('%') ? '%' : ''

  if (optionValue === '0' || optionValue === '0%') {
    return `0${suffix}`
  }

  return optionValue.startsWith('+') || optionValue.startsWith('-')
    ? `${optionValue}${suffix}`
    : `+${optionValue}${suffix}`
}

const getGradeBadgeLabel = (grade?: string | null) =>
  grade ? GRADE_BADGE_LABEL[grade] || grade.slice(0, 1) : '-'

const getGradeClass = (grade?: string | null) =>
  grade
    ? GRADE_TEXT_CLASS[grade] || 'border-white/50 text-white'
    : 'border-white/30 text-white/70'

const getPotentialRows = (
  first?: string | null,
  second?: string | null,
  third?: string | null
) =>
  [first, second, third].filter((option): option is string => Boolean(option))

const getOptionParts = (item: Equipment, key: OptionKey) => {
  const sourceParts: OptionPart[] = [
    {
      key: 'base',
      value: item.item_base_option?.[key],
      className: 'text-white'
    },
    {
      key: 'add',
      value: item.item_add_option?.[key],
      className: 'text-lime-300'
    },
    {
      key: 'etc',
      value: item.item_etc_option?.[key],
      className: 'text-indigo-300'
    },
    {
      key: 'starforce',
      value: item.item_starforce_option?.[key],
      className: 'text-yellow-300'
    },
    {
      key: 'exceptional',
      value: item.item_exceptional_option?.[key],
      className: 'text-orange-300'
    }
  ]
  const hasBonusParts = sourceParts
    .slice(1)
    .some(part => isMeaningfulOption(part.value))

  return sourceParts.filter(part =>
    part.key === 'base'
      ? hasBonusParts && hasOptionValue(part.value)
      : isMeaningfulOption(part.value)
  )
}

const getStatRows = (item: Equipment) =>
  STAT_OPTION_KEYS.map(key => {
    const total = formatSignedValue(key, item.item_total_option?.[key])

    if (!total || !isMeaningfulOption(item.item_total_option?.[key])) {
      return undefined
    }

    return {
      key,
      label: OPTION_LABELS[key] || key,
      total,
      parts: getOptionParts(item, key)
    }
  }).filter((row): row is StatRow => Boolean(row))

const formatExpireDate = (date?: string | null) => {
  if (!date) {
    return undefined
  }

  const expireDate = new Date(date)

  if (Number.isNaN(expireDate.getTime())) {
    return date
  }

  const month = expireDate.getMonth() + 1
  const day = expireDate.getDate()
  const hour = String(expireDate.getHours()).padStart(2, '0')
  const minute = String(expireDate.getMinutes()).padStart(2, '0')

  return `${expireDate.getFullYear()}년 ${month}월 ${day}일 ${hour}시 ${minute}분`
}

function EmptyPotentialState() {
  return (
    <section className="space-y-1 border-t border-dashed border-white/35 pt-2 text-xs font-bold leading-5 text-white/70">
      <p>잠재능력 : 없음</p>
      <p>에디셔널 잠재능력 : 없음</p>
    </section>
  )
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

function StarRows({ starforce }: { starforce: number }) {
  const rows = [
    Array.from({ length: 15 }, (_, index) => index < starforce),
    Array.from({ length: 10 }, (_, index) => index + 15 < starforce)
  ]

  return (
    <div className="mx-auto w-fit space-y-0.5 text-sm leading-none tracking-normal">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center gap-1.5">
          {Array.from({ length: Math.ceil(row.length / 5) }, (_, groupIndex) =>
            row.slice(groupIndex * 5, groupIndex * 5 + 5)
          ).map((group, groupIndex) => (
            <span
              className="inline-flex gap-0.5"
              key={`${rowIndex}-${groupIndex}`}>
              {group.map((isFilled, index) => (
                <span
                  key={`${rowIndex}-${groupIndex}-${index}`}
                  className={
                    isFilled
                      ? 'text-yellow-300 drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]'
                      : 'text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]'
                  }>
                  {isFilled ? '★' : '☆'}
                </span>
              ))}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function PotentialSection({
  grade,
  options,
  title
}: {
  grade?: string | null
  options: string[]
  title: string
}) {
  if (!grade && options.length === 0) {
    return null
  }

  return (
    <section className="space-y-1.5 border-t border-dashed border-white/35 pt-2">
      <div className="flex items-center gap-1.5 text-xs font-black">
        <span
          className={cn(
            'inline-flex h-4 min-w-4 items-center justify-center rounded border bg-black/40 px-1 text-[11px] leading-none',
            getGradeClass(grade)
          )}>
          {getGradeBadgeLabel(grade)}
        </span>
        <h3 className={cn('text-xs font-black', getGradeClass(grade))}>
          {title}
        </h3>
      </div>
      <div className="space-y-1 text-xs font-bold leading-5 text-white">
        {options.length > 0 ? (
          options.map((option, index) => (
            <p key={`${title}-${index}`}>{option}</p>
          ))
        ) : (
          <p className="text-white/70">옵션 정보 없음</p>
        )}
      </div>
    </section>
  )
}

function StatRows({ rows }: { rows: StatRow[] }) {
  if (rows.length === 0) {
    return <p className="text-xs font-bold text-white/60">옵션 정보 없음</p>
  }

  return (
    <dl className="space-y-1">
      {rows.map(row => {
        const isBaseOnly = row.parts.length === 0
        const primaryTextClass = isBaseOnly ? 'text-white' : 'text-cyan-300'

        return (
          <div
            key={row.key}
            className="flex flex-wrap items-baseline gap-x-1.5 text-xs font-black leading-5">
            <dt className={primaryTextClass}>{row.label} :</dt>
            <dd className={primaryTextClass}>{row.total}</dd>
            {row.parts.length > 0 && (
              <dd className="flex flex-wrap items-baseline gap-x-1.5 text-white">
                <span>(</span>
                {row.parts.map(part => (
                  <span
                    key={part.key}
                    className={part.className}>
                    {formatSignedValue(row.key, part.value)}
                  </span>
                ))}
                <span>)</span>
              </dd>
            )}
          </div>
        )
      })}
    </dl>
  )
}

export default function EquipmentHoverDetails({
  children,
  className,
  item,
  panelClassName,
  tabIndex,
  'aria-describedby': ariaDescribedBy,
  ...wrapperProps
}: EquipmentHoverDetailsProps) {
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

  const itemName = item.item_name || '이름 없는 장비'
  const partLabel =
    item.item_equipment_part || item.item_equipment_slot || '장비'
  const itemIcon = item.item_shape_icon || item.item_icon
  const starforce = Number.parseInt(item.starforce || '0', 10) || 0
  const potentialRows = getPotentialRows(
    item.potential_option_1,
    item.potential_option_2,
    item.potential_option_3
  )
  const additionalPotentialRows = getPotentialRows(
    item.additional_potential_option_1,
    item.additional_potential_option_2,
    item.additional_potential_option_3
  )
  const statRows = getStatRows(item)
  const itemDescription = item.item_description?.trim()
  const expireDateLabel = formatExpireDate(item.date_expire)
  const describedBy = [ariaDescribedBy, detailsId].filter(Boolean).join(' ')
  const cuttableCount =
    item.cuttable_count && item.cuttable_count !== '255'
      ? `가위 사용 가능 횟수 : ${item.cuttable_count}회`
      : undefined
  const isScrollUnavailable =
    item.scroll_upgradeable_count === '0' &&
    (!item.scroll_upgrade || item.scroll_upgrade === '0')
  const scrollInfo = isScrollUnavailable
    ? '주문서 강화 불가'
    : item.scroll_upgrade || item.scroll_upgradeable_count
      ? `주문서 ${item.scroll_upgrade || '0'}강 · 잔여 ${item.scroll_upgradeable_count || '0'}`
      : undefined
  const soulInfo = [item.soul_name, item.soul_option]
    .filter(Boolean)
    .join(' / ')
  const itemGrade =
    item.potential_option_grade || item.additional_potential_option_grade
  const hasPotentialDetails =
    Boolean(item.potential_option_grade) ||
    potentialRows.length > 0 ||
    Boolean(item.additional_potential_option_grade) ||
    additionalPotentialRows.length > 0

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
          'pointer-events-none invisible fixed z-[70] w-[min(25rem,calc(100vw-1rem))] overflow-visible rounded-lg border border-white/80 bg-neutral-950/95 p-3 text-left text-white opacity-0 shadow-2xl shadow-black/60 backdrop-blur-md transition duration-150 max-sm:w-[calc(100vw-1rem)]',
          HOVER_DETAILS_INTERACTIVE_VISIBILITY_CLASS,
          panelClassName
        )}>
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent_34%)]" />
        <div className="relative space-y-2">
          <header className="space-y-1 text-center">
            {starforce > 0 && <StarRows starforce={starforce} />}
            <div className="space-y-1 border-b border-dashed border-white/35 pb-2">
              <h2 className="break-words text-base font-black leading-snug text-white">
                {itemName}
                {starforce > 0 && (
                  <span className="ml-1 whitespace-nowrap">(+{starforce})</span>
                )}
              </h2>
              {expireDateLabel && (
                <p className="text-xs font-black text-orange-300">
                  유효 기간 : {expireDateLabel}
                </p>
              )}
              {itemGrade && (
                <p className="text-xs font-black text-white/70">
                  ({itemGrade} 아이템)
                </p>
              )}
            </div>
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
                <span className="text-xs font-black text-neutral-500">
                  ITEM
                </span>
              )}
            </div>
            <div className="space-y-1 self-end text-xs font-black leading-5 text-white">
              <p>장비분류 : {partLabel}</p>
              {item.item_shape_name && (
                <p className="text-xs text-white/80">
                  외형 : {item.item_shape_name}
                </p>
              )}
            </div>
          </div>

          {(statRows.length > 0 ||
            itemDescription ||
            cuttableCount ||
            scrollInfo ||
            soulInfo) && (
            <section className="space-y-1.5 border-t border-dashed border-white/35 pt-2">
              {statRows.length > 0 && <StatRows rows={statRows} />}
              {itemDescription && (
                <p className="text-xs font-bold leading-5 text-white">
                  {itemDescription}
                </p>
              )}
              {(cuttableCount || scrollInfo || soulInfo) && (
                <div
                  className={cn(
                    'flex flex-wrap gap-x-2 gap-y-0.5 text-xs font-black leading-5',
                    isScrollUnavailable && !cuttableCount && !soulInfo
                      ? 'text-white/45'
                      : 'text-yellow-300'
                  )}>
                  {cuttableCount && <p>{cuttableCount}</p>}
                  {scrollInfo && <p>{scrollInfo}</p>}
                  {soulInfo && <p>{soulInfo}</p>}
                </div>
              )}
            </section>
          )}

          {hasPotentialDetails ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <PotentialSection
                title="잠재옵션"
                grade={item.potential_option_grade}
                options={potentialRows}
              />

              <PotentialSection
                title="에디셔널 잠재옵션"
                grade={item.additional_potential_option_grade}
                options={additionalPotentialRows}
              />
            </div>
          ) : (
            <EmptyPotentialState />
          )}
        </div>
      </div>
    </div>
  )
}
