import artifactBalrog from '@/assets/union-artifacts/balrog.svg'
import artifactHornyMushroom from '@/assets/union-artifacts/horny-mushroom.svg'
import artifactOrangeMushroom from '@/assets/union-artifacts/orange-mushroom.svg'
import artifactPapulatus from '@/assets/union-artifacts/papulatus.svg'
import artifactPinkBean from '@/assets/union-artifacts/pink-bean.svg'
import artifactSlime from '@/assets/union-artifacts/slime.svg'
import artifactStoneGolem from '@/assets/union-artifacts/stone-golem.svg'
import artifactStump from '@/assets/union-artifacts/stump.svg'
import artifactZakum from '@/assets/union-artifacts/zakum.svg'
import hexaStatIcon1 from '@/assets/hexa-stats/hexa-stat-1.svg'
import hexaStatIcon2 from '@/assets/hexa-stats/hexa-stat-2.svg'
import hexaStatIcon3 from '@/assets/hexa-stats/hexa-stat-3.svg'
import {
  AbilityResponse,
  CharacterSkill,
  Equipment,
  HexaMatrixStatCore,
  LinkSkill,
  PetAutoSkill,
  PetEquipmentItem,
  PetEquipmentResponse,
  RequestStatus,
  UnionArtifactResponse,
  UnionChampionResponse,
  UnionRaiderPreset,
  UnionRaiderResponse,
  UnionResponse
} from '@/api/character.types'
import { HOVER_DETAILS_VISIBILITY_CLASS } from '@/components/shared/hoverDetailsClassNames'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCharacterAnalysis } from '@/hooks/useCharacterAnalysis'
import { useEquipment } from '@/hooks/useEquipment'
import { usePetEquipment } from '@/hooks/usePetEquipment'
import { cn } from '@/lib/utils'
import {
  Activity,
  Check,
  LayoutGrid,
  List,
  Network,
  PawPrint,
  Sparkles,
  WandSparkles
} from 'lucide-react'
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import EquipmentHoverDetails from './EquipmentHoverDetails'
import PetEquipmentHoverDetails from './PetEquipmentHoverDetails'

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

const LINK_SKILL_TOOLTIP_GAP = 10
const LINK_SKILL_TOOLTIP_VIEWPORT_PADDING = 12

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

const getListPotentialSummary = (item?: Equipment) => {
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

  return {
    additional: additionalLines.join('  '),
    potential: potentialLines.join('  ')
  }
}

type AbilityPresetNo = 1 | 2 | 3
type SymbolCategory = 'arcane' | 'authentic'

type PetInfo = {
  appearance?: string | null
  appearanceIcon?: string | null
  autoSkill?: PetAutoSkill | null
  dateExpire?: string | null
  description?: string | null
  equipment?: PetEquipmentItem | null
  expired?: boolean | null
  icon?: string | null
  name?: string | null
  nickname?: string | null
  petNo: 1 | 2 | 3
  petType?: string | null
  skills?: string[]
}

type UnionPresetNo = 1 | 2 | 3 | 4 | 5
type UnionPoint = {
  x?: number
  y?: number
}
type UnionBlock = {
  block_class?: string
  block_control_point?: UnionPoint
  block_level?: number | string
  block_position?: UnionPoint[]
  block_type?: string
}
type UnionInnerStat = {
  stat_field_effect?: string
  stat_field_id?: string
}
type UnionArtifactCrystal = {
  crystal_option_name_1?: string
  crystal_option_name_2?: string
  crystal_option_name_3?: string
  date_expire?: string
  level?: number
  name?: string
  validity_flag?: string
}

type LinkSkillHoverDetailsProps = {
  children: ReactNode
  skill: LinkSkill
}
type ArtifactEffectRow = {
  effect: string
  level?: number | string
}
type ArtifactDisplayTemplate = {
  keywords: string[]
  name: string
  options: [string, string, string]
  src: string
}

const UNION_PRESET_NUMBERS = [1, 2, 3, 4, 5] as const

const ARTIFACT_DISPLAY_TEMPLATES: ArtifactDisplayTemplate[] = [
  {
    keywords: ['주황버섯', 'orange mushroom'],
    name: '주황버섯',
    options: ['드랍', '메획', '경험치'],
    src: artifactOrangeMushroom
  },
  {
    keywords: ['슬라임', 'slime'],
    name: '슬라임',
    options: ['드랍', '메획', '경험치'],
    src: artifactSlime
  },
  {
    keywords: ['뿔버섯', 'horny mushroom'],
    name: '뿔버섯',
    options: ['보공', '방무', '크뎀'],
    src: artifactHornyMushroom
  },
  {
    keywords: ['스텀프', 'stump'],
    name: '스텀프',
    options: ['올스탯', '공/마', '데미지'],
    src: artifactStump
  },
  {
    keywords: ['스톤골렘', 'stone golem'],
    name: '스톤골렘',
    options: ['올스탯', '공/마', '데미지'],
    src: artifactStoneGolem
  },
  {
    keywords: ['발록', 'balrog'],
    name: '발록',
    options: ['보공', '방무', '크뎀'],
    src: artifactBalrog
  },
  {
    keywords: ['자쿰', 'zakum'],
    name: '자쿰',
    options: ['크확', '소환수', '벞지'],
    src: artifactZakum
  },
  {
    keywords: ['핑크빈', 'pink bean'],
    name: '핑크빈',
    options: ['아이템 드롭률', '소환수 지속시간', '추가 경험치'],
    src: artifactPinkBean
  },
  {
    keywords: ['파풀라투스', 'papulatus'],
    name: '파풀라투스',
    options: ['상태이상 내성', '파이널 어택류', '스킬 데미지'],
    src: artifactPapulatus
  }
]

const ARTIFACT_ICON_FALLBACKS = ARTIFACT_DISPLAY_TEMPLATES.map(icon => icon.src)

const HEXA_CORE_TONE_CLASSES = [
  'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-300/25 dark:bg-violet-400/10 dark:text-violet-100',
  'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-300/25 dark:bg-sky-400/10 dark:text-sky-100',
  'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/25 dark:bg-amber-400/10 dark:text-amber-100',
  'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/25 dark:bg-emerald-400/10 dark:text-emerald-100'
]

const HEXA_STAT_ICONS = [hexaStatIcon1, hexaStatIcon2, hexaStatIcon3]

const getActiveLinkSkills = (
  linkSkill: ReturnType<
    typeof useCharacterAnalysis
  >['analysisData']['linkSkill']
) => {
  if (!linkSkill) {
    return []
  }

  if (linkSkill.preset_no === 2) {
    return linkSkill.character_link_skill_preset_2 || []
  }

  if (linkSkill.preset_no === 3) {
    return linkSkill.character_link_skill_preset_3 || []
  }

  return (
    linkSkill.character_link_skill_preset_1 ||
    linkSkill.character_link_skill ||
    []
  )
}

const clampLinkSkillTooltipPosition = (
  value: number,
  min: number,
  max: number
) => Math.min(Math.max(value, min), max)

function LinkSkillHoverDetails({
  children,
  skill
}: LinkSkillHoverDetailsProps) {
  const detailsId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>()
  const skillName = skill.skill_name || '링크 스킬'
  const skillLevel = skill.skill_level || 0
  const skillDescription = skill.skill_description?.trim()
  const skillEffect = skill.skill_effect?.trim()
  const nextSkillEffect = skill.skill_effect_next?.trim()
  const hasDetails = Boolean(
    skillDescription || skillEffect || nextSkillEffect || skillName
  )
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
      LINK_SKILL_TOOLTIP_VIEWPORT_PADDING,
      window.innerWidth - panelWidth - LINK_SKILL_TOOLTIP_VIEWPORT_PADDING
    )
    const maxTop = Math.max(
      LINK_SKILL_TOOLTIP_VIEWPORT_PADDING,
      window.innerHeight - panelHeight - LINK_SKILL_TOOLTIP_VIEWPORT_PADDING
    )
    const nextLeft = clampLinkSkillTooltipPosition(
      triggerRect.left + triggerRect.width / 2 - panelWidth / 2,
      LINK_SKILL_TOOLTIP_VIEWPORT_PADDING,
      maxLeft
    )
    const aboveTop = triggerRect.top - panelHeight - LINK_SKILL_TOOLTIP_GAP
    const nextTop =
      aboveTop >= LINK_SKILL_TOOLTIP_VIEWPORT_PADDING
        ? aboveTop
        : clampLinkSkillTooltipPosition(
            triggerRect.bottom + LINK_SKILL_TOOLTIP_GAP,
            LINK_SKILL_TOOLTIP_VIEWPORT_PADDING,
            maxTop
          )

    setPanelStyle({
      left: nextLeft,
      top: nextTop
    })
  }, [])

  if (!hasDetails) {
    return <>{children}</>
  }

  return (
    <div
      ref={wrapperRef}
      aria-describedby={detailsId}
      className="group relative outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      onFocus={updatePanelPosition}
      onMouseEnter={updatePanelPosition}
      tabIndex={0}>
      {children}
      <div
        ref={panelRef}
        id={detailsId}
        role="tooltip"
        style={panelStyle}
        className={`pointer-events-none invisible fixed z-[9999] w-[min(20rem,calc(100vw-1rem))] rounded-lg border border-white/80 bg-neutral-950/95 p-3 text-left text-white opacity-0 shadow-2xl shadow-black/60 backdrop-blur-md transition duration-150 ${HOVER_DETAILS_VISIBILITY_CLASS}`}>
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent_36%)]" />
        <div className="relative space-y-3">
          <header className="grid grid-cols-[3.5rem_1fr] gap-3 border-b border-dashed border-white/35 pb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-sky-300 bg-white shadow-inner">
              {skill.skill_icon ? (
                <img
                  className="h-11 w-11 object-contain [image-rendering:pixelated]"
                  src={skill.skill_icon}
                  alt=""
                />
              ) : (
                <span className="text-sm font-black text-sky-700">LINK</span>
              )}
            </div>
            <div className="min-w-0 self-center">
              <h5 className="break-words text-base font-black leading-snug text-white">
                {skillName}
              </h5>
              <p className="mt-1 text-xs font-black text-sky-200">
                링크 스킬 Lv.{skillLevel}
              </p>
            </div>
          </header>

          <div className="space-y-2 text-xs font-bold leading-5">
            {skillDescription && (
              <p className="break-words text-white/80">{skillDescription}</p>
            )}
            {skillEffect && (
              <section className="rounded-md bg-sky-400/10 p-2">
                <p className="mb-1 text-[11px] font-black text-sky-200">
                  현재 효과
                </p>
                <p className="break-words text-white">{skillEffect}</p>
              </section>
            )}
            {nextSkillEffect && (
              <section className="rounded-md bg-white/5 p-2">
                <p className="mb-1 text-[11px] font-black text-white/60">
                  다음 레벨
                </p>
                <p className="break-words text-white/80">{nextSkillEffect}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

type HexaStatHoverDetailsProps = {
  children: ReactNode
  iconSrc: string
  statCore: HexaMatrixStatCore
}

function HexaStatHoverDetails({
  children,
  iconSrc,
  statCore
}: HexaStatHoverDetailsProps) {
  const detailsId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>()
  const statRows = [
    {
      label: statCore.main_stat_name || '메인 스탯',
      level: statCore.main_stat_level || 0,
      tone: 'bg-violet-400/15 text-violet-100'
    },
    {
      label: statCore.sub_stat_name_1 || '서브 스탯 1',
      level: statCore.sub_stat_level_1 || 0,
      tone: 'bg-sky-400/15 text-sky-100'
    },
    {
      label: statCore.sub_stat_name_2 || '서브 스탯 2',
      level: statCore.sub_stat_level_2 || 0,
      tone: 'bg-emerald-400/15 text-emerald-100'
    }
  ]
  const statTotalLevel = statRows.reduce((total, row) => total + row.level, 0)
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
      LINK_SKILL_TOOLTIP_VIEWPORT_PADDING,
      window.innerWidth - panelWidth - LINK_SKILL_TOOLTIP_VIEWPORT_PADDING
    )
    const maxTop = Math.max(
      LINK_SKILL_TOOLTIP_VIEWPORT_PADDING,
      window.innerHeight - panelHeight - LINK_SKILL_TOOLTIP_VIEWPORT_PADDING
    )
    const nextLeft = clampLinkSkillTooltipPosition(
      triggerRect.left + triggerRect.width / 2 - panelWidth / 2,
      LINK_SKILL_TOOLTIP_VIEWPORT_PADDING,
      maxLeft
    )
    const aboveTop = triggerRect.top - panelHeight - LINK_SKILL_TOOLTIP_GAP
    const nextTop =
      aboveTop >= LINK_SKILL_TOOLTIP_VIEWPORT_PADDING
        ? aboveTop
        : clampLinkSkillTooltipPosition(
            triggerRect.bottom + LINK_SKILL_TOOLTIP_GAP,
            LINK_SKILL_TOOLTIP_VIEWPORT_PADDING,
            maxTop
          )

    setPanelStyle({
      left: nextLeft,
      top: nextTop
    })
  }, [])

  return (
    <div
      ref={wrapperRef}
      aria-describedby={detailsId}
      className="group relative outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      onFocus={updatePanelPosition}
      onMouseEnter={updatePanelPosition}
      tabIndex={0}>
      {children}
      <div
        ref={panelRef}
        id={detailsId}
        role="tooltip"
        style={panelStyle}
        className={`pointer-events-none invisible fixed z-[9999] w-[min(20rem,calc(100vw-1rem))] rounded-lg border border-white/80 bg-neutral-950/95 p-3 text-left text-white opacity-0 shadow-2xl shadow-black/60 backdrop-blur-md transition duration-150 ${HOVER_DETAILS_VISIBILITY_CLASS}`}>
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent_36%)]" />
        <div className="relative space-y-3">
          <header className="grid grid-cols-[3.5rem_1fr] gap-3 border-b border-dashed border-white/35 pb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-violet-300 bg-violet-50 shadow-inner">
              <img
                src={iconSrc}
                alt=""
                className="h-12 w-12 object-contain [image-rendering:pixelated]"
              />
            </div>
            <div className="min-w-0 self-center">
              <h5 className="break-words text-base font-black leading-snug text-white">
                HEXA 스탯 코어
              </h5>
              <p className="mt-1 text-xs font-black text-violet-200">
                Lv.{statTotalLevel}
              </p>
            </div>
          </header>

          <div className="space-y-2">
            {statRows.map(row => (
              <div
                key={row.label}
                className={`flex items-center justify-between gap-3 rounded-md px-2.5 py-2 text-xs font-black ${row.tone}`}>
                <span className="min-w-0 break-keep">{row.label}</span>
                <span className="shrink-0 rounded bg-black/35 px-2 py-0.5 text-white">
                  Lv.{row.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const getHexaCoreInitial = (
  name: string | undefined,
  type: string | undefined
) => {
  const text = (name || type || 'H').replace(/\s/g, '')

  return text.slice(0, 1)
}

const normalizeSkillName = (name: string | undefined) =>
  (name || '').replace(/\s/g, '').toLowerCase()

const getHexaCoreSkillIcon = (
  coreName: string | undefined,
  skills: CharacterSkill[]
) => {
  const coreSkillNames = (coreName || '')
    .split('/')
    .map(normalizeSkillName)
    .filter(Boolean)

  if (coreSkillNames.length === 0) {
    return undefined
  }

  const exactMatchedSkill = skills.find(skill =>
    coreSkillNames.includes(normalizeSkillName(skill.skill_name))
  )

  if (exactMatchedSkill?.skill_icon) {
    return exactMatchedSkill.skill_icon
  }

  return skills.find(skill => {
    const skillName = normalizeSkillName(skill.skill_name)

    return coreSkillNames.some(
      coreSkillName =>
        skillName.includes(coreSkillName) || coreSkillName.includes(skillName)
    )
  })?.skill_icon
}

const getActiveHexaStatCores = (
  hexaStat: ReturnType<typeof useCharacterAnalysis>['analysisData']['hexaStat']
) =>
  [
    ...(hexaStat?.character_hexa_stat_core || []),
    ...(hexaStat?.character_hexa_stat_core_2 || []),
    ...(hexaStat?.character_hexa_stat_core_3 || [])
  ].filter(
    statCore =>
      statCore.main_stat_name ||
      statCore.sub_stat_name_1 ||
      statCore.sub_stat_name_2
  )

const getHexaStatCoreLevel = (statCore: HexaMatrixStatCore) =>
  (statCore.main_stat_level || 0) +
  (statCore.sub_stat_level_1 || 0) +
  (statCore.sub_stat_level_2 || 0)

const getHexaStatIcon = (index: number) =>
  HEXA_STAT_ICONS[index % HEXA_STAT_ICONS.length]

const formatNumber = (value?: number | string) => {
  if (value === undefined || value === '') {
    return '-'
  }

  const numericValue =
    typeof value === 'number'
      ? value
      : Number.parseFloat(value.replace(/,/g, ''))

  return Number.isNaN(numericValue)
    ? String(value)
    : numericValue.toLocaleString()
}

const getUnionMilestoneProgress = (level?: number) => {
  if (!level || level <= 0) {
    return { percent: 0, remaining: 500 }
  }

  const milestoneSize = 500
  const remainder = level % milestoneSize

  if (remainder === 0) {
    return { percent: 100, remaining: 0 }
  }

  return {
    percent: Math.round((remainder / milestoneSize) * 100),
    remaining: milestoneSize - remainder
  }
}

const getCombatPower = (
  stat: ReturnType<typeof useCharacterAnalysis>['analysisData']['stat']
) => {
  const combatPower = stat?.final_stat?.find(finalStat => {
    const statName = finalStat.stat_name || ''

    return (
      statName.includes('전투력') || statName.toLowerCase().includes('combat')
    )
  })

  return formatNumber(combatPower?.stat_value)
}

const getAbilityPreset = (
  ability: AbilityResponse | null,
  presetNo: AbilityPresetNo
) => {
  if (!ability) {
    return { grade: '-', info: [] }
  }

  if (presetNo === 1) {
    return {
      grade:
        ability.ability_preset_1?.ability_preset_grade ||
        ability.ability_grade ||
        '-',
      info: ability.ability_preset_1?.ability_info || ability.ability_info || []
    }
  }

  if (presetNo === 2) {
    return {
      grade: ability.ability_preset_2?.ability_preset_grade || '-',
      info: ability.ability_preset_2?.ability_info || []
    }
  }

  return {
    grade: ability.ability_preset_3?.ability_preset_grade || '-',
    info: ability.ability_preset_3?.ability_info || []
  }
}

function InsightCard({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-lg border border-emerald-200/70 bg-card p-4 text-foreground shadow-sm dark:border-emerald-300/15 dark:bg-white/[0.055]',
        className
      )}>
      {children}
    </section>
  )
}

function CharacterAnalysisOverview({ ocid }: { ocid: string | undefined }) {
  const { analysisData, status } = useCharacterAnalysis(ocid)
  const currentAbilityPresetNo =
    analysisData.ability?.preset_no === 2 ||
    analysisData.ability?.preset_no === 3
      ? analysisData.ability.preset_no
      : 1
  const [activeAbilityPresetNo, setActiveAbilityPresetNo] =
    useState<AbilityPresetNo>(currentAbilityPresetNo)
  const [symbolCategory, setSymbolCategory] = useState<SymbolCategory>('arcane')
  const setEffects = analysisData.setEffect?.set_effect || []
  const activeSetEffects = setEffects.filter(
    effect => (effect.total_set_count || 0) > 0
  )
  const symbols = analysisData.symbol?.symbol || []
  const activeLinkSkills = getActiveLinkSkills(analysisData.linkSkill)
  const hexaCores = analysisData.hexa?.character_hexa_core_equipment || []
  const sixthSkills = analysisData.sixthSkill?.character_skill || []
  const hexaStatCores = getActiveHexaStatCores(analysisData.hexaStat)
  const activeAbility = getAbilityPreset(
    analysisData.ability,
    activeAbilityPresetNo
  )
  const symbolCards = symbols.filter(symbol => {
    const symbolName = symbol.symbol_name || ''
    const isAuthentic = symbolName.includes('어센틱')

    return symbolCategory === 'authentic' ? isAuthentic : !isAuthentic
  })
  const symbolForceTotal = symbolCards.reduce((total, symbol) => {
    const force = Number.parseInt(symbol.symbol_force || '0', 10)

    return Number.isNaN(force) ? total : total + force
  }, 0)

  useEffect(() => {
    setActiveAbilityPresetNo(currentAbilityPresetNo)
  }, [currentAbilityPresetNo])

  if (status === 'loading') {
    return (
      <InsightCard>
        <p className="text-center text-sm font-bold text-muted-foreground">
          분석 정보를 불러오는 중입니다.
        </p>
      </InsightCard>
    )
  }

  if (status === 'error') {
    return (
      <InsightCard>
        <p className="text-center text-sm font-bold text-destructive">
          분석 정보를 불러오지 못했습니다.
        </p>
      </InsightCard>
    )
  }

  return (
    <div className="space-y-3">
      <InsightCard className="relative [container-type:inline-size] bg-[radial-gradient(circle_at_15%_5%,rgba(16,185,129,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(236,253,245,0.72)_54%,rgba(255,251,235,0.72))] p-5 dark:bg-[radial-gradient(circle_at_15%_5%,rgba(52,211,153,0.16),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(6,78,59,0.36)_54%,rgba(30,41,59,0.92))]">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-white/80 text-emerald-600 shadow-sm dark:border-emerald-300/20 dark:bg-white/10 dark:text-emerald-200">
            <Activity className="h-5 w-5" />
          </span>
          <p className="text-right text-xs font-black text-muted-foreground">
            현재 전투력
          </p>
        </div>
        <p className="mt-3 max-w-full overflow-hidden whitespace-nowrap text-right text-[clamp(1.75rem,8.5cqw,3rem)] font-black leading-tight tracking-normal text-foreground tabular-nums">
          {getCombatPower(analysisData.stat)}
        </p>
      </InsightCard>

      <InsightCard>
        <div className="mb-4">
          <h3 className="text-base font-black">적용중인 세트 효과</h3>
        </div>
        <div className="space-y-3">
          {activeSetEffects.slice(0, 5).map((effect, index) => (
            <div
              key={`${effect.set_name}-${index}`}
              className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/25 px-3 py-3 dark:bg-white/[0.04]">
              <p className="min-w-0 truncate text-sm font-black text-foreground">
                {effect.set_name || '세트 정보'}
              </p>
              <span className="shrink-0 rounded-md bg-blue-100 px-2 py-1 text-sm font-black text-blue-700 dark:bg-blue-400/15 dark:text-blue-200">
                {effect.total_set_count || 0}셋
              </span>
            </div>
          ))}
          {activeSetEffects.length === 0 && (
            <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm font-bold text-muted-foreground">
              적용 중인 세트효과가 없습니다.
            </p>
          )}
        </div>
      </InsightCard>

      <InsightCard>
        <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-muted/30 text-sm font-black dark:bg-white/[0.04]">
          {(['arcane', 'authentic'] as const).map(category => (
            <button
              key={category}
              type="button"
              onClick={() => setSymbolCategory(category)}
              className={`h-10 transition ${
                symbolCategory === category
                  ? 'bg-emerald-500 text-white dark:bg-emerald-300 dark:text-slate-950'
                  : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
              } ${category === 'arcane' ? 'border-r border-border' : ''}`}>
              {category === 'arcane' ? '아케인' : '어센틱'}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-sm font-bold text-muted-foreground">
          포스 {formatNumber(symbolForceTotal)}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {symbolCards.slice(0, 9).map(symbol => (
            <div
              key={symbol.symbol_name}
              className="rounded-lg border border-border bg-muted/30 p-3 text-center dark:bg-white/[0.04]">
              {symbol.symbol_icon ? (
                <img
                  src={symbol.symbol_icon}
                  alt=""
                  className="mx-auto h-12 w-12 object-contain"
                />
              ) : (
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
              )}
              <p className="mt-2 text-sm font-black">
                Lv.{symbol.symbol_level || 0}
              </p>
              <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-emerald-200 dark:bg-emerald-300/30" />
            </div>
          ))}
          {symbolCards.length === 0 && (
            <div className="col-span-3 rounded-lg border border-dashed border-border p-4 text-center text-sm font-bold text-muted-foreground">
              표시할 심볼이 없습니다.
            </div>
          )}
        </div>
      </InsightCard>

      <InsightCard>
        <div className="flex items-center justify-between gap-3">
          <h3 className="inline-flex items-center gap-2 text-base font-black">
            <WandSparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-200" />
            어빌리티
          </h3>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 dark:bg-amber-400/10 dark:text-amber-100">
            {activeAbility.grade}
          </span>
        </div>
        <p className="mt-3 text-sm font-bold text-muted-foreground">
          보유 명성치 : {formatNumber(analysisData.ability?.remain_fame)}
        </p>
        <div className="mt-4 space-y-2">
          {activeAbility.info.slice(0, 3).map((ability, index) => (
            <div
              key={`${ability.ability_no}-${index}`}
              className={`rounded-md px-3 py-2 text-center text-sm font-black ${
                ability.ability_grade === '레전드리'
                  ? 'bg-emerald-500 text-white dark:bg-emerald-300 dark:text-slate-950'
                  : 'bg-amber-400 text-amber-950'
              }`}>
              {ability.ability_value || '어빌리티 정보 없음'}
            </div>
          ))}
          {activeAbility.info.length === 0 && (
            <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm font-bold text-muted-foreground">
              어빌리티 정보가 없습니다.
            </p>
          )}
        </div>
        <div className="mt-4 grid grid-cols-4 overflow-hidden rounded-lg border border-border bg-muted/30 text-sm font-black dark:bg-white/[0.04]">
          <span className="flex h-10 items-center justify-center border-r border-border text-muted-foreground">
            프리셋
          </span>
          {([1, 2, 3] as const).map(presetNo => (
            <button
              key={presetNo}
              type="button"
              onClick={() => setActiveAbilityPresetNo(presetNo)}
              className={`h-10 border-r border-border transition last:border-r-0 ${
                activeAbilityPresetNo === presetNo
                  ? 'bg-emerald-500 text-white dark:bg-emerald-300 dark:text-slate-950'
                  : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
              }`}>
              {presetNo}
            </button>
          ))}
        </div>
      </InsightCard>

      <InsightCard>
        <div className="mb-4">
          <h3 className="text-base font-black">HEXA 스킬</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {hexaCores.map((core, index) => {
            const skillIcon = getHexaCoreSkillIcon(
              core.hexa_core_name,
              sixthSkills
            )

            return (
              <div
                key={`${core.hexa_core_name}-${index}`}
                className="group relative"
                title={`${core.hexa_core_name || 'HEXA 코어'} Lv.${core.hexa_core_level || 0}`}>
                <div
                  className={cn(
                    'flex aspect-square items-center justify-center overflow-hidden rounded-lg border text-lg font-black shadow-sm',
                    HEXA_CORE_TONE_CLASSES[
                      index % HEXA_CORE_TONE_CLASSES.length
                    ]
                  )}>
                  {skillIcon ? (
                    <img
                      src={skillIcon}
                      alt=""
                      className="h-12 w-12 object-contain [image-rendering:pixelated]"
                    />
                  ) : (
                    getHexaCoreInitial(core.hexa_core_name, core.hexa_core_type)
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 min-w-6 rounded-md bg-black px-1.5 py-0.5 text-center text-xs font-black leading-4 text-white shadow-sm">
                  {core.hexa_core_level || 0}
                </span>
              </div>
            )
          })}
          {hexaStatCores.map((statCore, index) => {
            const statIcon = getHexaStatIcon(index)

            return (
              <HexaStatHoverDetails
                key={`${statCore.slot_id || 'hexa-stat'}-${index}`}
                iconSrc={statIcon}
                statCore={statCore}>
                <div
                  className="group relative"
                  title={`HEXA 스탯 ${index + 1}`}>
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-violet-200 bg-violet-50 shadow-sm transition group-hover:border-violet-300 group-hover:bg-violet-100 dark:border-violet-300/25 dark:bg-violet-400/10">
                    <img
                      src={statIcon}
                      alt=""
                      className="h-12 w-12 object-contain [image-rendering:pixelated]"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 min-w-6 rounded-md bg-black px-1.5 py-0.5 text-center text-xs font-black leading-4 text-white shadow-sm">
                    {getHexaStatCoreLevel(statCore)}
                  </span>
                </div>
              </HexaStatHoverDetails>
            )
          })}
          {hexaCores.length === 0 && hexaStatCores.length === 0 && (
            <div className="col-span-4 rounded-lg border border-dashed border-border p-4 text-center text-sm font-bold text-muted-foreground">
              표시할 HEXA 스킬이 없습니다.
            </div>
          )}
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-sm font-black">링크 스킬</h4>
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-black text-sky-700 dark:bg-sky-400/10 dark:text-sky-100">
              {activeLinkSkills.length}개
            </span>
          </div>
          {activeLinkSkills.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {activeLinkSkills.slice(0, 12).map((skill, index) => (
                <LinkSkillHoverDetails
                  key={`${skill.skill_name}-${index}`}
                  skill={skill}>
                  <div className="relative">
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-sky-200 bg-sky-50 text-sm font-black text-sky-700 shadow-sm transition group-hover:border-sky-300 group-hover:bg-sky-100 dark:border-sky-300/25 dark:bg-sky-400/10 dark:text-sky-100 dark:group-hover:border-sky-300/45">
                      {skill.skill_icon ? (
                        <img
                          src={skill.skill_icon}
                          alt=""
                          className="h-12 w-12 object-contain [image-rendering:pixelated]"
                        />
                      ) : (
                        getHexaCoreInitial(skill.skill_name, 'L')
                      )}
                    </div>
                    <span className="absolute -bottom-1 -right-1 min-w-6 rounded-md bg-black px-1.5 py-0.5 text-center text-xs font-black leading-4 text-white shadow-sm">
                      {skill.skill_level || 0}
                    </span>
                  </div>
                </LinkSkillHoverDetails>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm font-bold text-muted-foreground">
              표시할 링크 스킬이 없습니다.
            </div>
          )}
        </div>
      </InsightCard>
    </div>
  )
}

function EquipmentInsightPanel({ ocid }: { ocid: string | undefined }) {
  return (
    <aside className="min-w-0 self-start space-y-4">
      <CharacterAnalysisOverview ocid={ocid} />
    </aside>
  )
}

const getPetInfos = (petData: PetEquipmentResponse | null): PetInfo[] => {
  if (!petData) {
    return []
  }

  const petInfos: PetInfo[] = [
    {
      appearance: petData.pet_1_appearance,
      appearanceIcon: petData.pet_1_appearance_icon,
      autoSkill: petData.pet_1_auto_skill,
      dateExpire: petData.pet_1_date_expire,
      description: petData.pet_1_description,
      equipment: petData.pet_1_equipment,
      expired: petData.pet_1_expired,
      icon: petData.pet_1_icon,
      name: petData.pet_1_name,
      nickname: petData.pet_1_nickname,
      petNo: 1,
      petType: petData.pet_1_pet_type,
      skills: petData.pet_1_skill
    },
    {
      appearance: petData.pet_2_appearance,
      appearanceIcon: petData.pet_2_appearance_icon,
      autoSkill: petData.pet_2_auto_skill,
      dateExpire: petData.pet_2_date_expire,
      description: petData.pet_2_description,
      equipment: petData.pet_2_equipment,
      expired: petData.pet_2_expired,
      icon: petData.pet_2_icon,
      name: petData.pet_2_name,
      nickname: petData.pet_2_nickname,
      petNo: 2,
      petType: petData.pet_2_pet_type,
      skills: petData.pet_2_skill
    },
    {
      appearance: petData.pet_3_appearance,
      appearanceIcon: petData.pet_3_appearance_icon,
      autoSkill: petData.pet_3_auto_skill,
      dateExpire: petData.pet_3_date_expire,
      description: petData.pet_3_description,
      equipment: petData.pet_3_equipment,
      expired: petData.pet_3_expired,
      icon: petData.pet_3_icon,
      name: petData.pet_3_name,
      nickname: petData.pet_3_nickname,
      petNo: 3,
      petType: petData.pet_3_pet_type,
      skills: petData.pet_3_skill
    }
  ]

  return petInfos.filter(
    pet =>
      pet.name ||
      pet.nickname ||
      pet.icon ||
      pet.appearanceIcon ||
      pet.equipment
  )
}

function PetEquipmentPanel({
  petData,
  status
}: {
  petData: PetEquipmentResponse | null
  status: RequestStatus
}) {
  const petInfos = getPetInfos(petData)

  return (
    <section className="mt-4 rounded-lg border border-border bg-card p-3 shadow-sm dark:bg-white/[0.04]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="inline-flex items-center gap-2 text-sm font-black text-foreground">
            <PawPrint className="h-4 w-4 text-emerald-600 dark:text-emerald-200" />
            펫 정보
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            장착 중인 펫과 펫 장비를 확인합니다.
          </p>
        </div>
        <span className="rounded-md bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
          {status === 'loading' ? '조회중' : `${petInfos.length}마리`}
        </span>
      </div>

      {status === 'loading' ? (
        <div className="grid gap-2 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-lg border border-border bg-muted/60"
            />
          ))}
        </div>
      ) : status === 'error' ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-bold text-destructive">
          펫 정보를 불러오지 못했습니다.
        </div>
      ) : petInfos.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-3">
          {petInfos.map(pet => {
            const petIcon = pet.appearanceIcon || pet.icon
            const equipmentIcon =
              pet.equipment?.item_shape_icon || pet.equipment?.item_icon
            return (
              <article
                key={pet.petNo}
                className="min-w-0 rounded-lg border border-border bg-background/70 p-3 dark:bg-black/10">
                <div className="grid min-w-0 grid-cols-[3rem_minmax(0,1fr)] gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted/50">
                    {petIcon ? (
                      <img
                        className="h-10 w-10 object-contain [image-rendering:pixelated]"
                        src={petIcon}
                        alt=""
                      />
                    ) : (
                      <PawPrint className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-foreground">
                      {pet.nickname || pet.name || `펫 ${pet.petNo}`}
                    </p>
                    <p className="mt-1 truncate text-xs font-semibold text-muted-foreground">
                      {pet.name || pet.petType || '펫 정보'}
                    </p>
                    {pet.expired && (
                      <span className="mt-2 inline-flex rounded-md bg-red-50 px-2 py-1 text-[11px] font-black text-red-600 dark:bg-red-400/10 dark:text-red-200">
                        기간 만료
                      </span>
                    )}
                  </div>
                </div>

                {pet.equipment && (
                  <PetEquipmentHoverDetails
                    item={pet.equipment}
                    className="mt-3 block min-w-0">
                    <div className="flex min-w-0 items-center gap-2 rounded-md bg-muted/60 px-2 py-2 transition hover:bg-muted dark:bg-white/5 dark:hover:bg-white/10">
                      {equipmentIcon && (
                        <img
                          className="h-7 w-7 shrink-0 object-contain [image-rendering:pixelated]"
                          src={equipmentIcon}
                          alt=""
                        />
                      )}
                      <p className="min-w-0 truncate text-xs font-black text-foreground">
                        {pet.equipment.item_name || '펫 장비'}
                      </p>
                    </div>
                  </PetEquipmentHoverDetails>
                )}
              </article>
            )
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm font-bold text-muted-foreground">
          표시할 펫 정보가 없습니다.
        </div>
      )}
    </section>
  )
}

function UnionEffectColumn({
  className = '',
  emptyLabel,
  items,
  title
}: {
  className?: string
  emptyLabel: string
  items: string[]
  title: string
}) {
  return (
    <div
      className={cn(
        'min-w-0 rounded-lg border border-border bg-background/75 p-3 dark:bg-black/10',
        className
      )}>
      <h4 className="text-sm font-black text-foreground">{title}</h4>
      {items.length > 0 ? (
        <ul className="mt-3 grid gap-1.5">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}-${item}`}
              className="min-w-0 rounded-md bg-muted/60 px-2.5 py-1.5 text-xs font-bold leading-5 text-muted-foreground dark:bg-white/[0.04]">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 rounded-md border border-dashed border-border px-2 py-3 text-center text-xs font-bold text-muted-foreground">
          {emptyLabel}
        </p>
      )}
    </div>
  )
}

const getUnionPresetNo = (value?: number): UnionPresetNo =>
  UNION_PRESET_NUMBERS.includes(value as UnionPresetNo)
    ? (value as UnionPresetNo)
    : 1

const getUnionPresetBlocks = (
  unionRaider: UnionRaiderResponse | null,
  presetNo: UnionPresetNo
): UnionBlock[] => {
  const preset = getUnionRaiderPreset(unionRaider, presetNo)
  const blocks = preset?.union_block || []

  return blocks.map(block => block as UnionBlock)
}

const getUnionRaiderPreset = (
  unionRaider: UnionRaiderResponse | null,
  presetNo: UnionPresetNo
): UnionRaiderPreset | null => {
  if (!unionRaider) {
    return null
  }

  const presetKey =
    `union_raider_preset_${presetNo}` as keyof UnionRaiderResponse
  const preset = unionRaider[presetKey]

  if (preset && !Array.isArray(preset) && typeof preset === 'object') {
    return preset as UnionRaiderPreset
  }

  if (presetNo === getUnionPresetNo(unionRaider.use_preset_no)) {
    return {
      union_block: unionRaider.union_block || [],
      union_inner_stat: unionRaider.union_inner_stat || [],
      union_occupied_stat: unionRaider.union_occupied_stat || [],
      union_raider_stat: unionRaider.union_raider_stat || []
    }
  }

  return null
}

const EMPTY_UNION_CELL_CLASS = 'bg-white/95 dark:bg-slate-900/75'

const UNION_OCCUPIED_CELL_CLASS = 'bg-[#d7c5ae] dark:bg-amber-300/20'

const UNION_BOARD_OUTER_LABELS = [
  { label: '내성', left: '37%', top: '13%' },
  { label: '경험치', left: '63%', top: '13%' },
  { label: '크뎀', left: '12%', top: '37%' },
  { label: '크확', left: '88%', top: '37%' },
  { label: '방무', left: '12%', top: '63%' },
  { label: '보공', left: '88%', top: '63%' },
  { label: '벞지', left: '37%', top: '88%' },
  { label: '일몹뎀', left: '63%', top: '88%' }
]

const UNION_BOARD_INNER_LABEL_POSITIONS = [
  { fallbackLabel: 'HP', left: '34%', statFieldId: '0', top: '56%' },
  { fallbackLabel: 'MP', left: '56%', statFieldId: '1', top: '31%' },
  { fallbackLabel: '마력', left: '34%', statFieldId: '2', top: '43%' },
  { fallbackLabel: '공격력', left: '43%', statFieldId: '3', top: '69%' },
  { fallbackLabel: 'DEX', left: '56%', statFieldId: '4', top: '69%' },
  { fallbackLabel: 'LUK', left: '43%', statFieldId: '5', top: '31%' },
  { fallbackLabel: 'STR', left: '68%', statFieldId: '6', top: '56%' },
  { fallbackLabel: 'INT', left: '68%', statFieldId: '7', top: '43%' }
]

const formatUnionInnerStatLabel = (statEffect?: string) =>
  (statEffect || '')
    .replace(/^유니온\s*/, '')
    .replace(/^최대\s*/, '')
    .trim()

const getUnionBoardLabels = (innerStats: UnionInnerStat[]) => {
  const innerLabelByFieldId = new Map(
    innerStats
      .filter(stat => stat.stat_field_id !== undefined)
      .map(stat => [
        stat.stat_field_id || '',
        formatUnionInnerStatLabel(stat.stat_field_effect)
      ])
  )

  return [
    ...UNION_BOARD_OUTER_LABELS,
    ...UNION_BOARD_INNER_LABEL_POSITIONS.map(position => ({
      label:
        innerLabelByFieldId.get(position.statFieldId) || position.fallbackLabel,
      left: position.left,
      top: position.top
    }))
  ]
}

const getArtifactCrystals = (
  unionArtifact: UnionArtifactResponse | null
): UnionArtifactCrystal[] =>
  (unionArtifact?.union_artifact_crystal || []).map(
    crystal => crystal as UnionArtifactCrystal
  )

const getArtifactOptions = (crystal: UnionArtifactCrystal) =>
  [
    crystal.crystal_option_name_1,
    crystal.crystal_option_name_2,
    crystal.crystal_option_name_3
  ].filter((option): option is string => Boolean(option))

const getArtifactNameLabel = (name?: string) =>
  (name || '').replace(/^크리스탈\s*:\s*/, '').trim()

const getArtifactIconUrl = (name: string | undefined, index: number) => {
  const normalizedName = getArtifactNameLabel(name).toLowerCase()
  const matchedIcon = ARTIFACT_DISPLAY_TEMPLATES.find(icon =>
    icon.keywords.some(keyword => normalizedName.includes(keyword))
  )

  return (
    matchedIcon?.src ??
    ARTIFACT_ICON_FALLBACKS[index % ARTIFACT_ICON_FALLBACKS.length]
  )
}

const getArtifactDisplayCrystals = (
  unionArtifact: UnionArtifactResponse | null
): UnionArtifactCrystal[] => getArtifactCrystals(unionArtifact)

const getArtifactEffectRows = (
  unionArtifact: UnionArtifactResponse | null
): ArtifactEffectRow[] => {
  const apiEffects = (
    unionArtifact?.union_artifact_effect || []
  ).flatMap<ArtifactEffectRow>(record => {
    const values = Object.values(record).filter(
      (value): value is string | number =>
        typeof value === 'string' || typeof value === 'number'
    )

    if (values.length === 0) {
      return []
    }

    const maybeLevel = values[values.length - 1]
    const hasLevel =
      typeof maybeLevel === 'number' ||
      (typeof maybeLevel === 'string' && /^\d+$/.test(maybeLevel))
    const effectValues = hasLevel ? values.slice(0, -1) : values
    const effect = effectValues.map(value => String(value)).join(' · ')

    if (!effect) {
      return []
    }

    return [
      {
        effect,
        level: hasLevel ? maybeLevel : undefined
      }
    ]
  })

  if (apiEffects.length > 0) {
    return apiEffects
  }

  const optionLevels = new Map<string, number>()

  getArtifactCrystals(unionArtifact).forEach(crystal => {
    getArtifactOptions(crystal).forEach(option => {
      optionLevels.set(
        option,
        Math.max(optionLevels.get(option) || 0, crystal.level || 0)
      )
    })
  })

  return Array.from(optionLevels.entries()).map(([effect, level]) => ({
    effect,
    level: level > 0 ? level : undefined
  }))
}

const formatDateLabel = (value?: string) => {
  if (!value) {
    return undefined
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return `(${String(date.getFullYear()).slice(2)}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일 만료)`
}

function UnionArtifactCard({
  crystal,
  index
}: {
  crystal: UnionArtifactCrystal
  index: number
}) {
  const expiredLabel = formatDateLabel(crystal.date_expire)
  const displayName =
    getArtifactNameLabel(crystal.name) || `아티팩트 ${index + 1}`
  const iconUrl = getArtifactIconUrl(displayName, index)
  const filledPips = Math.max(1, Math.min(5, crystal.level || 0))

  return (
    <article className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-4 text-center shadow-[0_1px_4px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.055]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center">
        <img
          src={iconUrl}
          alt={`${displayName} 아이콘`}
          className="h-24 w-24 object-contain drop-shadow-[0_0_14px_rgba(129,140,248,0.42)]"
          loading="lazy"
        />
      </div>
      <div className="mt-1 flex h-4 items-center justify-center gap-2">
        {Array.from({ length: filledPips }).map((_, pipIndex) => (
          <span
            key={`${displayName}-pip-${pipIndex}`}
            className="h-2 w-2 rotate-45 rounded-[2px] bg-cyan-100 shadow-[0_0_8px_rgba(103,232,249,0.9)] ring-1 ring-white/80"
          />
        ))}
      </div>
      <p className="mt-3 truncate text-lg font-black text-foreground">
        {displayName}
      </p>
      {expiredLabel && (
        <p className="mt-1 text-sm font-black text-rose-500 dark:text-rose-200">
          {expiredLabel}
        </p>
      )}
    </article>
  )
}

function UnionArtifactPanel({
  union,
  unionArtifact
}: {
  union: UnionResponse | null
  unionArtifact: UnionArtifactResponse | null
}) {
  const crystals = getArtifactDisplayCrystals(unionArtifact)
  const artifactEffects = getArtifactEffectRows(unionArtifact)

  return (
    <section className="rounded-lg border border-border bg-white p-5 shadow-sm dark:bg-white/[0.04] sm:p-6">
      <h3 className="text-2xl font-black tracking-normal text-foreground">
        유니온 아티팩트
      </h3>

      <div className="mt-5 grid gap-8 2xl:grid-cols-[minmax(34rem,1fr)_minmax(22rem,0.78fr)] 2xl:items-start">
        {crystals.length > 0 ? (
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {crystals.map((crystal, index) => (
              <UnionArtifactCard
                key={`${crystal.name}-${index}`}
                crystal={crystal}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm font-bold text-muted-foreground">
            표시할 아티팩트 크리스탈이 없습니다.
          </div>
        )}

        <aside className="min-w-0 pt-1">
          <div className="flex flex-wrap items-end gap-2">
            <h4 className="text-xl font-black text-foreground">
              아티팩트 Lv.{formatNumber(union?.union_artifact_level)}
            </h4>
            <span className="mb-0.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-500 dark:bg-white/10 dark:text-slate-300">
              남은 AP {formatNumber(unionArtifact?.union_artifact_remain_ap)}
            </span>
            <span className="mb-0.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-500 dark:bg-white/10 dark:text-slate-300">
              포인트 {formatNumber(union?.union_artifact_point)}
            </span>
          </div>

          {artifactEffects.length > 0 ? (
            <ul className="mt-3 space-y-1.5">
              {artifactEffects.map((effect, index) => (
                <li
                  key={`${effect.effect}-${index}`}
                  className="grid min-w-0 grid-cols-[3.25rem_minmax(0,1fr)] items-start gap-2 text-base font-bold leading-7 text-foreground">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-center font-black text-slate-500 dark:bg-white/10 dark:text-slate-300">
                    {effect.level ? `Lv.${effect.level}` : 'Lv.-'}
                  </span>
                  <span className="min-w-0 break-keep">{effect.effect}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-center text-sm font-bold text-muted-foreground">
              아티팩트 효과가 없습니다.
            </p>
          )}
        </aside>
      </div>
    </section>
  )
}

function UnionRaiderBoard({
  blocks,
  innerStats
}: {
  blocks: UnionBlock[]
  innerStats: UnionInnerStat[]
}) {
  const boardColumnCount = 22
  const boardRowCount = 20
  const boardXOffset = 11
  const boardYOffset = 10
  const occupiedCells = new Map<string, UnionBlock>()

  blocks.forEach(block => {
    block.block_position?.forEach(point => {
      if (typeof point.x !== 'number' || typeof point.y !== 'number') {
        return
      }

      const column = Math.round(point.x + boardXOffset)
      const row = Math.round(boardYOffset - point.y)

      if (
        column >= 0 &&
        column < boardColumnCount &&
        row >= 0 &&
        row < boardRowCount
      ) {
        occupiedCells.set(`${row}-${column}`, block)
      }
    })
  })

  const labels = getUnionBoardLabels(innerStats)

  return (
    <div className="relative mx-auto aspect-[22/20] w-full max-w-[31rem] overflow-hidden rounded-sm border border-slate-300/70 bg-slate-200/80 p-px shadow-[inset_0_0_0_1px_rgba(226,232,240,0.45)] dark:border-slate-600/70 dark:bg-slate-700/70">
      <div
        className="grid h-full w-full gap-px"
        style={{
          gridTemplateColumns: `repeat(${boardColumnCount}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${boardRowCount}, minmax(0, 1fr))`
        }}>
        {Array.from({ length: boardColumnCount * boardRowCount }).map(
          (_, index) => {
            const row = Math.floor(index / boardColumnCount)
            const column = index % boardColumnCount
            const block = occupiedCells.get(`${row}-${column}`)

            return (
              <span
                key={`${row}-${column}`}
                title={
                  block
                    ? `${block.block_class || '공격대원'} Lv.${block.block_level || '-'}`
                    : undefined
                }
                className={cn(
                  'relative min-h-0 min-w-0 text-[0.45rem] leading-none',
                  block ? UNION_OCCUPIED_CELL_CLASS : EMPTY_UNION_CELL_CLASS
                )}
              />
            )
          }
        )}
      </div>
      {labels.map(label => (
        <span
          key={`${label.label}-${label.left}-${label.top}`}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(0.72rem,1.5vw,1rem)] font-black text-white [text-shadow:0_1px_4px_rgba(15,23,42,0.65),0_0_2px_rgba(15,23,42,0.85)]"
          style={{
            left: label.left,
            top: label.top
          }}>
          {label.label}
        </span>
      ))}
    </div>
  )
}

function UnionRaiderPanel({
  union,
  unionChampion,
  unionRaider
}: {
  union: UnionResponse | null
  unionChampion: UnionChampionResponse | null
  unionRaider: UnionRaiderResponse | null
}) {
  const currentPresetNo = getUnionPresetNo(unionRaider?.use_preset_no)
  const [activePresetNo, setActivePresetNo] =
    useState<UnionPresetNo>(currentPresetNo)
  const levelProgress = getUnionMilestoneProgress(union?.union_level)
  const activeBlocks = getUnionPresetBlocks(unionRaider, activePresetNo)
  const championCount = unionChampion?.union_champion?.length || 0

  useEffect(() => {
    setActivePresetNo(currentPresetNo)
  }, [currentPresetNo])
  const activePreset = getUnionRaiderPreset(unionRaider, activePresetNo)
  const activeRaiderStats = activePreset?.union_raider_stat || []
  const activeOccupiedStats = activePreset?.union_occupied_stat || []
  const activeInnerStats = (activePreset?.union_inner_stat || []).map(
    stat => stat as UnionInnerStat
  )

  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm dark:bg-white/[0.04]">
      <div className="mb-4 flex flex-col gap-3 border-b border-border pb-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="inline-flex items-center gap-2 text-base font-black text-foreground">
            <Network className="h-4 w-4 text-emerald-600 dark:text-emerald-200" />
            유니온 공격대
          </h3>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            배치 프리셋, 공격대원 효과, 점령 효과를 한 번에 확인합니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
            {union?.union_grade || '등급 정보 없음'}
          </span>
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-black text-muted-foreground">
            Lv.{formatNumber(union?.union_level)}
          </span>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-border bg-muted/25 p-3 dark:bg-black/10">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-muted-foreground">
          <span>다음 500레벨 단위까지</span>
          <span>
            {levelProgress.remaining === 0
              ? '도달'
              : `${formatNumber(levelProgress.remaining)} 레벨`}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted shadow-inner dark:bg-black/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300"
            style={{ width: `${levelProgress.percent}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(18rem,0.95fr)_minmax(0,1.05fr)]">
        <div className="min-w-0">
          <UnionRaiderBoard
            blocks={activeBlocks}
            innerStats={activeInnerStats}
          />
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm font-black">
            <span className="text-muted-foreground">프리셋</span>
            {UNION_PRESET_NUMBERS.map(presetNo => (
              <button
                key={presetNo}
                type="button"
                onClick={() => setActivePresetNo(presetNo)}
                className={cn(
                  'inline-flex min-w-8 items-center justify-center rounded-md px-2.5 py-1.5 transition',
                  activePresetNo === presetNo
                    ? 'bg-muted text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                aria-pressed={activePresetNo === presetNo}>
                {presetNo}
                {currentPresetNo === presetNo && (
                  <Check className="ml-1 h-3.5 w-3.5" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-black text-muted-foreground sm:grid-cols-4">
            <span className="rounded-md bg-muted/70 px-2 py-2 text-center dark:bg-white/[0.04]">
              블록 {formatNumber(activeBlocks.length)}
            </span>
            <span className="rounded-md bg-muted/70 px-2 py-2 text-center dark:bg-white/[0.04]">
              챔피언 {formatNumber(championCount)}
            </span>
            <span className="rounded-md bg-muted/70 px-2 py-2 text-center dark:bg-white/[0.04]">
              공격대 {formatNumber(activeRaiderStats.length)}
            </span>
            <span className="rounded-md bg-muted/70 px-2 py-2 text-center dark:bg-white/[0.04]">
              점령 {formatNumber(activeOccupiedStats.length)}
            </span>
          </div>
        </div>

        <div className="grid min-w-0 content-start gap-3 xl:grid-cols-2">
          <UnionEffectColumn
            title="공격대원 효과"
            items={activeRaiderStats}
            emptyLabel="공격대원 효과가 없습니다."
          />
          <UnionEffectColumn
            title="공격대 점령 효과"
            items={activeOccupiedStats}
            emptyLabel="점령 효과가 없습니다."
          />
        </div>
      </div>
    </section>
  )
}

function UnionDetailPanel({ ocid }: { ocid: string | undefined }) {
  const { analysisData, status } = useCharacterAnalysis(ocid)
  const union = analysisData.union
  const unionRaider = analysisData.unionRaider
  const unionArtifact = analysisData.unionArtifact
  const unionChampion = analysisData.unionChampion

  return (
    <div className="mt-4 space-y-4">
      {status === 'loading' ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-lg border border-border bg-muted/60"
            />
          ))}
        </div>
      ) : !union && !unionRaider && !unionArtifact ? (
        <section className="rounded-lg border border-dashed border-border p-6 text-center text-sm font-bold text-muted-foreground">
          표시할 유니온 정보가 없습니다.
        </section>
      ) : (
        <>
          <UnionArtifactPanel
            union={union}
            unionArtifact={unionArtifact}
          />
          <UnionRaiderPanel
            union={union}
            unionChampion={unionChampion}
            unionRaider={unionRaider}
          />
        </>
      )}
    </div>
  )
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
  const potentialSummary = getListPotentialSummary(item)
  const hasPotentialSummary = Boolean(
    potentialSummary.potential || potentialSummary.additional
  )

  return (
    <li className="min-w-0">
      <EquipmentHoverDetails
        item={item}
        className="block min-w-0">
        <article className="relative grid min-h-[92px] min-w-0 grid-cols-[3.5rem_minmax(0,1fr)] gap-3 overflow-hidden rounded-lg border border-border bg-card p-3 shadow-sm transition hover:border-emerald-300/80 dark:hover:border-emerald-400/40">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
            {itemIcon ? (
              <img
                className="h-11 w-11 object-contain [image-rendering:pixelated]"
                src={itemIcon}
                alt=""
              />
            ) : (
              <span className="text-xs font-semibold text-muted-foreground">
                ITEM
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="mb-1.5 flex min-w-0 flex-wrap items-center gap-1 sm:pr-16">
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-bold text-muted-foreground sm:hidden">
                {item?.item_equipment_slot ||
                  item?.item_equipment_part ||
                  '장비'}
              </span>
              {starforce > 0 && (
                <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-black text-amber-700 dark:bg-amber-400/15 dark:text-amber-200">
                  {starforce}성
                </span>
              )}
              {potentialGradeLabel && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[11px] font-black ${getCompactGradeClass(item?.potential_option_grade)}`}>
                  {potentialGradeLabel}
                </span>
              )}
              {additionalGradeLabel && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[11px] font-black ${getCompactGradeClass(item?.additional_potential_option_grade)}`}>
                  {additionalGradeLabel}
                </span>
              )}
              {item?.scroll_upgrade && (
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-bold text-muted-foreground">
                  주문서 {item.scroll_upgrade}
                </span>
              )}
            </div>
            <p className="truncate text-sm font-black text-foreground">
              {isLoading ? '장비 정보를 불러오는 중' : item?.item_name || '-'}
            </p>
            {isLoading ? (
              <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
                잠시만 기다려주세요
              </p>
            ) : hasPotentialSummary ? (
              <div className="mt-1 space-y-0.5 text-xs font-semibold leading-5 text-muted-foreground">
                {potentialSummary.potential && (
                  <p className="grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] gap-2">
                    <span className="font-black text-emerald-600 dark:text-emerald-200">
                      잠재
                    </span>
                    <span className="min-w-0 break-words">
                      {potentialSummary.potential}
                    </span>
                  </p>
                )}
                {potentialSummary.additional && (
                  <p className="grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] gap-2">
                    <span className="font-black text-fuchsia-600 dark:text-fuchsia-200">
                      에디
                    </span>
                    <span className="min-w-0 break-words">
                      {potentialSummary.additional}
                    </span>
                  </p>
                )}
              </div>
            ) : null}
          </div>
          <span className="absolute right-3 top-3 hidden max-w-[5.5rem] truncate rounded-md bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground sm:block">
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
  const { petData, status: petStatus } = usePetEquipment(ocid)
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
  const renderEquipmentControls = () => (
    <div className="flex flex-col items-start gap-2 sm:items-end">
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
      <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
        {presets.map(preset => (
          <button
            key={preset.presetNo}
            type="button"
            disabled={status === 'loading'}
            onClick={() => setActivePresetNo(preset.presetNo)}
            className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
              activePresetNo === preset.presetNo
                ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-200'
                : 'border-border bg-background text-muted-foreground hover:border-emerald-300 hover:text-foreground dark:bg-white/5'
            }`}>
            프리셋 {preset.presetNo}
            {currentPresetNo === preset.presetNo && (
              <Check
                className="h-3.5 w-3.5"
                aria-label="현재 프리셋"
              />
            )}
          </button>
        ))}
      </div>
    </div>
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
          <TabsContent
            value="slots"
            className="mt-0">
            <div className="grid min-w-0 gap-5 overflow-hidden xl:grid-cols-[minmax(17rem,24rem)_minmax(0,1fr)] xl:items-start">
              <EquipmentInsightPanel ocid={ocid} />
              <div className="min-w-0 w-full self-start">
                <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-muted/25 p-3 shadow-sm dark:bg-white/5 sm:p-4">
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-sm font-black">아이템 슬롯</h3>
                      <p className="text-xs text-muted-foreground">
                        장비창 위치 기준으로 장착 아이템을 확인합니다.
                      </p>
                      <span className="mt-2 inline-flex rounded-md bg-background px-2 py-1 text-xs font-bold text-muted-foreground shadow-sm dark:bg-white/10">
                        {status === 'loading'
                          ? '조회중'
                          : `${filledSlotDefinitions.length}/${EQUIPMENT_SLOT_DEFINITIONS.length}`}
                      </span>
                    </div>
                    {renderEquipmentControls()}
                  </div>
                  <div
                    className="grid min-w-0 grid-cols-5 gap-1.5 rounded-md border border-border/70 bg-background/70 p-2 dark:bg-black/20 sm:gap-2 sm:p-3"
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
                            {item.item_equipment_slot ||
                              item.item_equipment_part}
                          </span>
                        </EquipmentHoverDetails>
                      ))}
                    </div>
                  )}
                  <PetEquipmentPanel
                    petData={petData}
                    status={petStatus}
                  />
                  <UnionDetailPanel ocid={ocid} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="list"
            className="mt-0">
            <div className="grid min-w-0 gap-5 overflow-hidden xl:grid-cols-[minmax(17rem,24rem)_minmax(0,1fr)] xl:items-start">
              <EquipmentInsightPanel ocid={ocid} />
              <div className="min-w-0 w-full self-start">
                <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-muted/25 p-3 shadow-sm dark:bg-white/5 sm:p-4">
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-sm font-black">아이템 목록</h3>
                      <p className="text-xs text-muted-foreground">
                        장착 아이템을 리스트로 확인합니다.
                      </p>
                      <span className="mt-2 inline-flex rounded-md bg-background px-2 py-1 text-xs font-bold text-muted-foreground shadow-sm dark:bg-white/10">
                        {status === 'loading'
                          ? '조회중'
                          : `${sortedEquipmentData.length}개`}
                      </span>
                    </div>
                    {renderEquipmentControls()}
                  </div>
                  {status === 'loading' ? (
                    <ul className="grid min-w-0 gap-2 xl:grid-cols-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <EquipmentListCard
                          key={index}
                          isLoading
                        />
                      ))}
                    </ul>
                  ) : sortedEquipmentData.length > 0 ? (
                    <ul className="grid min-w-0 gap-2 xl:grid-cols-2">
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
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </section>
  )
}
