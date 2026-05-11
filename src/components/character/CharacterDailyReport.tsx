import { Equipment, RequestStatus } from '@/api/character.types'
import { useCashEquipment } from '@/hooks/useCashEquipment'
import { useCharacterBasic } from '@/hooks/useCharacterBasic'
import { useEquipment } from '@/hooks/useEquipment'
import {
  BadgeCheck,
  CalendarCheck,
  ClipboardList,
  Gauge,
  Gem,
  Palette,
  Shirt,
  Sparkles,
  Star,
  Swords,
  Target,
  TrendingUp
} from 'lucide-react'
import { getActiveCashItems } from './cody.utils'

type Props = {
  ocid: string | undefined
}

type ReportMetric = {
  icon: typeof Sparkles
  label: string
  value: string
  tone: string
}

type ReportAction = {
  badge: string
  description: string
  icon: typeof ClipboardList
  tone: string
  title: string
}

type ReportHighlight = {
  description: string
  icon: typeof Gem
  label: string
  tone: string
  value: string
}

const getStarforce = (starforce?: string) =>
  Number.parseInt(starforce || '0', 10) || 0

const getReportStatus = (...statuses: RequestStatus[]) => {
  if (statuses.includes('loading')) {
    return 'loading'
  }

  if (statuses.includes('error')) {
    return 'error'
  }

  return 'idle'
}

const getLevelMood = (level: number) => {
  if (level >= 285) {
    return '최상위 성장 구간'
  }

  if (level >= 260) {
    return '그란디스 성장 구간'
  }

  if (level >= 200) {
    return '아케인 리버 성장 구간'
  }

  return '성장 준비 구간'
}

const getReportScore = ({
  activeCashItemCount,
  equipmentCount,
  level,
  totalStarforce
}: {
  activeCashItemCount: number
  equipmentCount: number
  level: number
  totalStarforce: number
}) => {
  if (!level && !equipmentCount && !activeCashItemCount) {
    return 0
  }

  const levelScore = Math.min(35, Math.floor(level / 9))
  const equipmentScore = Math.min(25, equipmentCount)
  const starforceScore = Math.min(30, Math.floor(totalStarforce / 12))
  const codyScore = Math.min(10, activeCashItemCount)

  return Math.min(100, levelScore + equipmentScore + starforceScore + codyScore)
}

const getReportKeyword = (score: number, totalStarforce: number) => {
  if (score >= 85) {
    return '오늘 준비도 높음'
  }

  if (totalStarforce >= 300) {
    return '성장 기반 안정'
  }

  if (score >= 60) {
    return '점검하기 좋은 날'
  }

  return '기본 정보 수집 중'
}

const getTopStarEquipment = (equipmentData: Equipment[]) =>
  equipmentData.reduce<Equipment | null>((selectedEquipment, equipment) => {
    if (!selectedEquipment) {
      return equipment
    }

    return getStarforce(equipment.starforce) >
      getStarforce(selectedEquipment.starforce)
      ? equipment
      : selectedEquipment
  }, null)

export default function CharacterDailyReport({ ocid }: Props) {
  const { basicData, status: basicStatus } = useCharacterBasic(ocid)
  const { equipmentData, status: equipmentStatus } = useEquipment(ocid)
  const { beautyData, cashData, status: cashStatus } = useCashEquipment(ocid)
  const status = getReportStatus(basicStatus, equipmentStatus, cashStatus)
  const activeCashItems = getActiveCashItems(cashData)
  const level = basicData.character_level || 0
  const totalStarforce = equipmentData.reduce(
    (total, item) => total + getStarforce(item.starforce),
    0
  )
  const reportScore = getReportScore({
    activeCashItemCount: activeCashItems.length,
    equipmentCount: equipmentData.length,
    level,
    totalStarforce
  })
  const reportScoreWidth = `${reportScore}%`
  const topStarEquipment = getTopStarEquipment(equipmentData)
  const topStarforce = getStarforce(topStarEquipment?.starforce)
  const reportKeyword = getReportKeyword(reportScore, totalStarforce)
  const reportTitle =
    status === 'loading'
      ? '오늘의 리포트를 작성 중이에요'
      : status === 'error'
        ? '일부 정보를 다시 확인해 주세요'
        : `${basicData.character_name || '캐릭터'}님의 오늘 리포트`
  const reportSummary =
    status === 'loading'
      ? '캐릭터 기본 정보, 장비, 코디 데이터를 모으고 있습니다.'
      : status === 'error'
        ? 'Nexon API 응답 중 일부가 실패했습니다. 잠시 후 다시 조회하면 리포트가 채워질 수 있어요.'
        : `${getLevelMood(level)}입니다. 오늘은 성장 점검, 대표 장비, 코디 무드를 한 번에 훑기 좋은 날이에요.`

  const metrics: ReportMetric[] = [
    {
      icon: TrendingUp,
      label: '성장 구간',
      tone: 'text-emerald-700 dark:text-emerald-200',
      value: level ? getLevelMood(level) : '정보 없음'
    },
    {
      icon: BadgeCheck,
      label: '장비 확인도',
      tone: 'text-amber-700 dark:text-amber-200',
      value:
        status === 'loading' ? '-' : `${equipmentData.length}개 장비 확인됨`
    },
    {
      icon: Star,
      label: '총 스타포스',
      tone: 'text-sky-700 dark:text-sky-200',
      value: status === 'loading' ? '-' : `${totalStarforce}`
    },
    {
      icon: Shirt,
      label: '코디 프리셋',
      tone: 'text-pink-700 dark:text-pink-200',
      value: status === 'loading' ? '-' : `${activeCashItems.length}개 아이템`
    }
  ]

  const actions: ReportAction[] = [
    {
      badge: '1',
      description:
        equipmentData.length >= 20
          ? '장비가 충분히 조회됐어요. 잠재 옵션과 스타포스가 낮은 부위부터 비교해 보세요.'
          : '장비 정보가 적게 잡혔어요. 장착 장비가 모두 조회되는지 먼저 확인해 보세요.',
      icon: Swords,
      tone: 'bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-200',
      title: '장비 상태 점검'
    },
    {
      badge: '2',
      description: beautyData
        ? `${beautyData.character_hair.hair_name}, ${beautyData.character_face.face_name} 조합이에요. 명함 카드에 코디 무드를 붙이기 좋아요.`
        : '헤어와 성형 정보를 불러오면 캐릭터 명함에 코디 무드를 붙일 수 있어요.',
      icon: Shirt,
      tone: 'bg-pink-50 text-pink-700 dark:bg-pink-400/10 dark:text-pink-200',
      title: '코디 무드 확인'
    },
    {
      badge: '3',
      description:
        level >= 260
          ? '고레벨 구간이라 이벤트 보상, 심볼, 장비 성장 재료 공지를 우선 확인하는 구성이 잘 맞아요.'
          : '성장 구간이라 레벨업 이벤트와 경험치 관련 공지를 먼저 보여주면 좋아요.',
      icon: CalendarCheck,
      tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200',
      title: '오늘 볼 공지 추천'
    }
  ]

  const highlights: ReportHighlight[] = [
    {
      description: topStarEquipment
        ? `${topStarforce}성 · ${topStarEquipment.item_equipment_part || '장비'}`
        : '장비 데이터를 불러오면 가장 높은 스타포스 장비가 표시됩니다.',
      icon: Gem,
      label: '오늘의 대표 장비',
      tone: 'border-amber-200 bg-amber-50/75 text-amber-800 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100',
      value: topStarEquipment?.item_name || '장비 분석 대기'
    },
    {
      description: beautyData
        ? `${beautyData.character_face.face_name}와 잘 어울리는 오늘의 코디 포인트입니다.`
        : '뷰티 데이터를 불러오면 헤어와 성형 조합이 표시됩니다.',
      icon: Palette,
      label: '오늘의 코디 포인트',
      tone: 'border-pink-200 bg-pink-50/75 text-pink-800 dark:border-pink-300/20 dark:bg-pink-400/10 dark:text-pink-100',
      value: beautyData?.character_hair.hair_name || '코디 분석 대기'
    }
  ]

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-lg border border-emerald-200/70 bg-card shadow-sm dark:border-emerald-300/15">
        <div className="grid gap-5 bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(255,251,235,0.88)_48%,rgba(248,250,252,0.95))] p-5 dark:bg-[linear-gradient(135deg,rgba(6,78,59,0.35),rgba(68,64,60,0.24)_48%,rgba(15,23,42,0.98))] lg:grid-cols-[1fr_240px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/75 px-3 py-1 text-sm font-black text-emerald-700 shadow-sm dark:border-emerald-300/20 dark:bg-white/10 dark:text-emerald-200">
                <Sparkles className="h-4 w-4" />
                오늘의 캐릭터 리포트
              </p>
              <span className="rounded-full bg-foreground px-3 py-1 text-xs font-black text-background">
                {reportKeyword}
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-normal text-foreground sm:text-4xl">
              {reportTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              {reportSummary}
            </p>

            <div className="mt-5 rounded-lg border border-white/80 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-muted-foreground">
                    오늘 준비도
                  </p>
                  <p className="mt-1 text-2xl font-black text-foreground">
                    {status === 'loading' ? '-' : `${reportScore}점`}
                  </p>
                </div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
                  <Gauge className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 shadow-inner dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-pink-300"
                  style={{
                    width: status === 'loading' ? '35%' : reportScoreWidth
                  }}
                />
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[220px] items-end justify-center overflow-hidden rounded-lg border border-white/70 bg-white/60 p-4 shadow-inner dark:border-white/10 dark:bg-white/[0.055]">
            <div className="absolute bottom-5 h-10 w-40 rounded-full bg-amber-300/35 blur-sm dark:bg-amber-300/15" />
            {basicData.character_image ? (
              <img
                className="relative z-10 h-44 w-44 scale-125 object-contain drop-shadow-[0_16px_24px_rgba(15,23,42,0.25)] [image-rendering:pixelated]"
                src={basicData.character_image}
                alt={basicData.character_name || '캐릭터 이미지'}
              />
            ) : (
              <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-lg border border-dashed border-border bg-background/80 text-sm font-bold text-muted-foreground">
                이미지 대기
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-3 border-t border-border bg-background/55 p-4 dark:bg-white/[0.025] sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(metric => {
            const Icon = metric.icon

            return (
              <div
                className="rounded-lg border border-border bg-background/80 p-3 shadow-sm dark:bg-white/[0.04]"
                key={metric.label}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-muted-foreground">
                    {metric.label}
                  </p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p
                  className={`mt-2 truncate text-lg font-black ${metric.tone}`}>
                  {metric.value}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-lg border border-border bg-background/80 p-5 shadow-sm dark:bg-white/[0.04]">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200">
              <Star className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-black text-foreground">오늘의 한 줄</p>
              <p className="text-xs font-medium text-muted-foreground">
                캐릭터 데이터를 기준으로 만든 가벼운 추천입니다.
              </p>
            </div>
          </div>
          <p className="mt-4 text-lg font-black leading-7 text-foreground">
            {status === 'loading'
              ? '잠시만요. 오늘의 방향을 고르고 있어요.'
              : status === 'error'
                ? '데이터가 비어 있는 부분부터 다시 조회해 보세요.'
                : totalStarforce >= 300
                  ? '오늘은 장비보다 이벤트와 코디를 확인하기 좋은 상태예요.'
                  : '오늘은 장비 성장 여지를 먼저 살펴보기 좋아 보여요.'}
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm font-bold text-foreground dark:bg-white/[0.04]">
            <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            오늘은 한 섹션만 골라도 충분히 의미 있어요.
          </div>
        </aside>

        <div className="grid gap-3 sm:grid-cols-2">
          {highlights.map(highlight => {
            const Icon = highlight.icon

            return (
              <article
                className={`rounded-lg border p-4 shadow-sm ${highlight.tone}`}
                key={highlight.label}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-black opacity-75">
                      {highlight.label}
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-lg font-black">
                      {highlight.value}
                    </h3>
                  </div>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/65 dark:bg-white/10">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold leading-6 opacity-80">
                  {highlight.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {actions.map(action => {
          const Icon = action.icon

          return (
            <article
              className="rounded-lg border border-border bg-background/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300/80 hover:shadow-md dark:bg-white/[0.04] dark:hover:border-emerald-400/40"
              key={action.title}>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${action.tone}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-muted-foreground">
                    미션 {action.badge}
                  </p>
                  <h3 className="text-sm font-black text-foreground">
                    {action.title}
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
                {action.description}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
