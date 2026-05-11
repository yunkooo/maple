import { Equipment } from '@/api/character.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEquipment } from '@/hooks/useEquipment'
import { cn } from '@/lib/utils'
import { LayoutGrid, List } from 'lucide-react'
import { useMemo } from 'react'
import EquipmentHoverDetails from './EquipmentHoverDetails'

type Props = {
  ocid: string | undefined
}

type EquipmentSlotDefinition = {
  aliases: string[]
  column: number
  key: string
  label: string
  row: number
}

const EQUIPMENT_SLOT_DEFINITIONS: EquipmentSlotDefinition[] = [
  { key: 'ring1', label: '반지1', aliases: ['반지1'], row: 1, column: 1 },
  { key: 'hat', label: '모자', aliases: ['모자'], row: 1, column: 3 },
  { key: 'emblem', label: '엠블렘', aliases: ['엠블렘'], row: 1, column: 5 },
  { key: 'ring2', label: '반지2', aliases: ['반지2'], row: 2, column: 1 },
  {
    key: 'face',
    label: '얼굴',
    aliases: ['얼굴장식'],
    row: 2,
    column: 2
  },
  { key: 'eye', label: '눈', aliases: ['눈장식'], row: 2, column: 3 },
  { key: 'earring', label: '귀고리', aliases: ['귀고리'], row: 2, column: 4 },
  { key: 'badge', label: '뱃지', aliases: ['뱃지'], row: 2, column: 5 },
  { key: 'ring3', label: '반지3', aliases: ['반지3'], row: 3, column: 1 },
  { key: 'pendant1', label: '펜던트', aliases: ['펜던트'], row: 3, column: 2 },
  {
    key: 'top',
    label: '상의',
    aliases: ['상의', '한벌옷'],
    row: 3,
    column: 3
  },
  {
    key: 'shoulder',
    label: '어깨',
    aliases: ['어깨장식'],
    row: 3,
    column: 4
  },
  {
    key: 'secondary',
    label: '보조',
    aliases: ['보조무기'],
    row: 3,
    column: 5
  },
  { key: 'ring4', label: '반지4', aliases: ['반지4'], row: 4, column: 1 },
  {
    key: 'pendant2',
    label: '펜던트2',
    aliases: ['펜던트2'],
    row: 4,
    column: 2
  },
  { key: 'bottom', label: '하의', aliases: ['하의'], row: 4, column: 3 },
  { key: 'glove', label: '장갑', aliases: ['장갑'], row: 4, column: 4 },
  { key: 'weapon', label: '무기', aliases: ['무기'], row: 4, column: 5 },
  {
    key: 'pocket',
    label: '포켓',
    aliases: ['포켓 아이템', '포켓아이템'],
    row: 5,
    column: 1
  },
  { key: 'belt', label: '벨트', aliases: ['벨트'], row: 5, column: 2 },
  { key: 'shoes', label: '신발', aliases: ['신발'], row: 5, column: 3 },
  { key: 'cape', label: '망토', aliases: ['망토'], row: 5, column: 4 },
  {
    key: 'heart',
    label: '하트',
    aliases: ['기계 심장', '기계심장'],
    row: 5,
    column: 5
  },
  { key: 'medal', label: '훈장', aliases: ['훈장'], row: 6, column: 3 }
]

const getEquipmentSlotKey = (item: Equipment) => {
  const slotName = item.item_equipment_slot || ''
  const slotDefinition = EQUIPMENT_SLOT_DEFINITIONS.find(slot =>
    slot.aliases.includes(slotName)
  )

  return slotDefinition?.key || slotName
}

const getSlotOrder = (item: Equipment) => {
  const index = EQUIPMENT_SLOT_DEFINITIONS.findIndex(
    slot => slot.key === getEquipmentSlotKey(item)
  )
  return index === -1 ? EQUIPMENT_SLOT_DEFINITIONS.length : index
}

const getGradeAccentClass = (grade?: string | null) => {
  if (grade === '레전드리') {
    return 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-emerald-500/10 dark:border-emerald-400/50 dark:bg-emerald-400/10 dark:text-emerald-200'
  }

  if (grade === '유니크') {
    return 'border-yellow-300 bg-yellow-50 text-yellow-700 shadow-yellow-500/10 dark:border-yellow-300/50 dark:bg-yellow-300/10 dark:text-yellow-200'
  }

  if (grade === '에픽') {
    return 'border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700 shadow-fuchsia-500/10 dark:border-fuchsia-400/50 dark:bg-fuchsia-400/10 dark:text-fuchsia-200'
  }

  if (grade === '레어') {
    return 'border-sky-300 bg-sky-50 text-sky-700 shadow-sky-500/10 dark:border-sky-400/50 dark:bg-sky-400/10 dark:text-sky-200'
  }

  return 'border-border bg-card text-muted-foreground shadow-black/5 dark:bg-white/5'
}

const getCompactGradeLabel = (grade?: string | null) => {
  if (grade === '레전드리') {
    return 'L'
  }

  if (grade === '유니크') {
    return 'U'
  }

  if (grade === '에픽') {
    return 'E'
  }

  if (grade === '레어') {
    return 'R'
  }

  return undefined
}

const getCompactGradeClass = (grade?: string | null) => {
  if (grade === '레전드리') {
    return 'border border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-400/15 dark:text-emerald-200'
  }

  if (grade === '유니크') {
    return 'border border-yellow-300 bg-yellow-100 text-yellow-700 dark:border-yellow-300/40 dark:bg-yellow-300/15 dark:text-yellow-200'
  }

  if (grade === '에픽') {
    return 'border border-fuchsia-300 bg-fuchsia-100 text-fuchsia-700 dark:border-fuchsia-400/40 dark:bg-fuchsia-400/15 dark:text-fuchsia-200'
  }

  if (grade === '레어') {
    return 'border border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-400/40 dark:bg-sky-400/15 dark:text-sky-200'
  }

  return 'border border-border bg-muted text-muted-foreground'
}

const getPotentialLines = (
  first?: string | null,
  second?: string | null,
  third?: string | null
) =>
  [first, second, third].filter((option): option is string => Boolean(option))

const getListSummary = (item?: Equipment) => {
  const potentialLines = getPotentialLines(
    item?.potential_option_1,
    item?.potential_option_2,
    item?.potential_option_3
  )
  const additionalLines = getPotentialLines(
    item?.additional_potential_option_1,
    item?.additional_potential_option_2,
    item?.additional_potential_option_3
  )
  const summary = [
    ...potentialLines.slice(0, 2),
    ...additionalLines.slice(0, 1).map(option => `에디 ${option}`)
  ]

  return summary.length > 0
    ? summary.join('  ')
    : item?.item_equipment_part || '옵션 정보 없음'
}

function EquipmentSlotButton({
  item,
  slot
}: {
  item?: Equipment
  slot: EquipmentSlotDefinition
}) {
  const starforce = Number.parseInt(item?.starforce || '0', 10)
  const itemIcon = item?.item_shape_icon || item?.item_icon
  const potentialGradeLabel = getCompactGradeLabel(item?.potential_option_grade)

  return (
    <div
      className="min-h-[58px] sm:min-h-[74px]"
      style={{
        gridColumn: slot.column,
        gridRow: slot.row
      }}>
      <EquipmentHoverDetails
        item={item}
        className="block h-full">
        <div
          className={cn(
            'relative flex h-full min-h-[58px] w-full flex-col items-center justify-center gap-0.5 rounded-md border p-1 text-center shadow-inner transition sm:min-h-[74px] sm:gap-1 sm:p-1.5',
            item
              ? `${getGradeAccentClass(item.potential_option_grade)} hover:-translate-y-0.5 hover:shadow-md`
              : 'border-dashed border-border bg-muted/30 text-muted-foreground/60 hover:bg-muted/50'
          )}>
          {starforce > 0 && (
            <span className="absolute right-0.5 top-0.5 rounded bg-amber-100 px-1 text-[9px] font-black leading-4 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200 sm:right-1 sm:top-1 sm:text-[10px]">
              {starforce}★
            </span>
          )}
          {potentialGradeLabel && (
            <span
              className={cn(
                'absolute left-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded px-0.5 text-[9px] font-black leading-none sm:left-1 sm:top-1 sm:h-5 sm:min-w-5 sm:text-[10px]',
                getCompactGradeClass(item?.potential_option_grade)
              )}>
              {potentialGradeLabel}
            </span>
          )}
          {itemIcon ? (
            <img
              className="h-7 w-7 object-contain [image-rendering:pixelated] sm:h-9 sm:w-9"
              src={itemIcon}
              alt=""
            />
          ) : (
            <span className="h-7 w-7 rounded border border-border/70 bg-background/60 sm:h-9 sm:w-9" />
          )}
          <span className="max-w-full truncate text-[9px] font-bold leading-3 sm:text-[10px]">
            {slot.label}
          </span>
        </div>
      </EquipmentHoverDetails>
    </div>
  )
}

function EquipmentListCard({
  isLoading = false,
  item
}: {
  isLoading?: boolean
  item?: Equipment
}) {
  const starforce = Number.parseInt(item?.starforce || '0', 10)
  const itemIcon = item?.item_shape_icon || item?.item_icon
  const potentialGradeLabel = getCompactGradeLabel(item?.potential_option_grade)
  const additionalGradeLabel = getCompactGradeLabel(
    item?.additional_potential_option_grade
  )

  return (
    <li>
      <EquipmentHoverDetails
        item={item}
        className="block">
        <article className="relative flex min-h-[118px] gap-4 rounded-lg border border-border bg-card p-4 shadow-sm transition hover:border-emerald-300/80 dark:hover:border-emerald-400/40">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
            {itemIcon ? (
              <img
                className="h-12 w-12 object-contain"
                src={itemIcon}
                alt=""
              />
            ) : (
              <span className="text-xs font-semibold text-muted-foreground">
                ITEM
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 pr-16">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {starforce > 0 && (
                <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-xs font-black text-amber-700 dark:bg-amber-400/15 dark:text-amber-200">
                  {starforce}성
                </span>
              )}
              {potentialGradeLabel && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs font-black ${getCompactGradeClass(item?.potential_option_grade)}`}>
                  {potentialGradeLabel}
                </span>
              )}
              {additionalGradeLabel && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs font-black ${getCompactGradeClass(item?.additional_potential_option_grade)}`}>
                  {additionalGradeLabel}
                </span>
              )}
              {item?.scroll_upgrade && (
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-bold text-muted-foreground">
                  주문서 {item.scroll_upgrade}
                </span>
              )}
            </div>
            <p className="truncate text-base font-black text-foreground">
              {isLoading ? '장비 정보를 불러오는 중' : item?.item_name || '-'}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-muted-foreground">
              {isLoading ? '잠시만 기다려주세요' : getListSummary(item)}
            </p>
          </div>
          <span className="absolute right-3 top-3 max-w-[72px] truncate rounded-md bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
            {item?.item_equipment_slot || item?.item_equipment_part || '장비'}
          </span>
        </article>
      </EquipmentHoverDetails>
    </li>
  )
}

export default function EquipmentSection({ ocid }: Props) {
  const {
    activePresetNo,
    currentPresetNo,
    equipmentData,
    presets,
    setActivePresetNo,
    status
  } = useEquipment(ocid)
  const sortedEquipmentData = useMemo(
    () =>
      [...equipmentData].sort(
        (leftItem, rightItem) =>
          getSlotOrder(leftItem) - getSlotOrder(rightItem)
      ),
    [equipmentData]
  )
  const equipmentBySlotKey = useMemo(
    () =>
      new Map(
        sortedEquipmentData.map(item => [getEquipmentSlotKey(item), item])
      ),
    [sortedEquipmentData]
  )
  const filledSlotDefinitions = useMemo(
    () =>
      EQUIPMENT_SLOT_DEFINITIONS.filter(slot =>
        equipmentBySlotKey.has(slot.key)
      ),
    [equipmentBySlotKey]
  )
  const extraEquipmentData = useMemo(
    () =>
      sortedEquipmentData.filter(
        item =>
          !EQUIPMENT_SLOT_DEFINITIONS.some(
            slot => slot.key === getEquipmentSlotKey(item)
          )
      ),
    [sortedEquipmentData]
  )
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-lg font-black">장비 정보</h2>
      </header>
      {status === 'error' ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          장비 정보를 불러오지 못했습니다.
        </div>
      ) : (
        <Tabs
          defaultValue="slots"
          className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <TabsList className="h-auto rounded-lg border border-border bg-background p-1 shadow-sm dark:bg-white/5">
              <TabsTrigger
                value="slots"
                className="gap-2 rounded-md px-3 py-2 text-sm font-bold text-muted-foreground data-[state=active]:border-b-0 data-[state=active]:bg-emerald-500 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-400 dark:data-[state=active]:text-slate-950">
                <LayoutGrid className="h-4 w-4" />
                장비창형
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="gap-2 rounded-md px-3 py-2 text-sm font-bold text-muted-foreground data-[state=active]:border-b-0 data-[state=active]:bg-emerald-500 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-400 dark:data-[state=active]:text-slate-950">
                <List className="h-4 w-4" />
                리스트형
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-2">
              {presets.map(preset => (
                <button
                  key={preset.presetNo}
                  type="button"
                  disabled={status === 'loading'}
                  onClick={() => setActivePresetNo(preset.presetNo)}
                  className={`rounded-lg border px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    activePresetNo === preset.presetNo
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-200'
                      : 'border-border bg-background text-muted-foreground hover:border-emerald-300 hover:text-foreground dark:bg-white/5'
                  }`}>
                  프리셋 {preset.presetNo}
                  {currentPresetNo === preset.presetNo && (
                    <span className="ml-1 text-[10px] font-bold">현재</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <TabsContent
            value="slots"
            className="mt-0">
            <div className="max-w-[31rem]">
              <div className="rounded-lg border border-border bg-muted/25 p-3 shadow-sm dark:bg-white/5 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black">아이템 슬롯</h3>
                    <p className="text-xs text-muted-foreground">
                      장비창 위치 기준으로 장착 아이템을 확인합니다.
                    </p>
                  </div>
                  <span className="rounded-md bg-background px-2 py-1 text-xs font-bold text-muted-foreground shadow-sm dark:bg-white/10">
                    {status === 'loading'
                      ? '조회중'
                      : `${filledSlotDefinitions.length}/${EQUIPMENT_SLOT_DEFINITIONS.length}`}
                  </span>
                </div>
                <div
                  className="grid grid-cols-5 gap-1.5 rounded-md border border-border/70 bg-background/70 p-2 dark:bg-black/20 sm:gap-2 sm:p-3"
                  style={{
                    gridTemplateRows: 'repeat(6, minmax(58px, 1fr))'
                  }}>
                  {EQUIPMENT_SLOT_DEFINITIONS.map(slot => (
                    <EquipmentSlotButton
                      key={slot.key}
                      slot={slot}
                      item={equipmentBySlotKey.get(slot.key)}
                    />
                  ))}
                </div>
                {extraEquipmentData.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                    {extraEquipmentData.map(item => (
                      <EquipmentHoverDetails
                        key={`${item.item_equipment_slot}-${item.item_name}`}
                        item={item}
                        className="inline-block">
                        <span className="block rounded-md border border-border bg-card px-2 py-1 text-xs font-bold text-muted-foreground hover:border-emerald-300 hover:text-foreground">
                          {item.item_equipment_slot || item.item_equipment_part}
                        </span>
                      </EquipmentHoverDetails>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="list"
            className="mt-0">
            {status === 'loading' ? (
              <ul className="grid gap-3 lg:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <EquipmentListCard
                    key={index}
                    isLoading
                  />
                ))}
              </ul>
            ) : sortedEquipmentData.length > 0 ? (
              <ul className="grid gap-3 lg:grid-cols-2">
                {sortedEquipmentData.map(item => (
                  <EquipmentListCard
                    key={`${item.item_equipment_slot}-${item.item_name}`}
                    item={item}
                  />
                ))}
              </ul>
            ) : (
              <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-border bg-muted/30 p-6 text-sm font-medium text-muted-foreground">
                표시할 장비 정보가 없습니다.
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </section>
  )
}
