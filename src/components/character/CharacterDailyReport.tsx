import { Equipment, RequestStatus } from '@/api/character.types'
import { useCashEquipment } from '@/hooks/useCashEquipment'
import { useCharacterBasic } from '@/hooks/useCharacterBasic'
import { useEquipment } from '@/hooks/useEquipment'
import {
  cautionPoints,
  codyPointMessages,
  dailyFortunes,
  formatDailyReportTemplate,
  getStableHash,
  luckyEquipmentMessages,
  luckyKeywords,
  luckyTimes,
  pickDailyItem
} from '@/lib/dailyReportFortune'
import {
  generateCharacterNicknames,
  getNicknameStyleLabel,
  NicknameStyle
} from '@/lib/nicknameGenerator'
import {
  Clock3,
  Compass,
  Gauge,
  Palette,
  Sparkles,
  Star,
  Target
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { getActiveCashItems } from './cody.utils'

type Props = {
  ocid: string | undefined
}

type ReportHighlight = {
  description: string
  icon: typeof Sparkles
  label: string
  tone: string
  value: string
}

const nicknameStyles: NicknameStyle[] = [
  'random',
  'cool',
  'cute',
  'dark',
  'boss'
]

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

const getKoreanDateKey = () => {
  const parts = new Intl.DateTimeFormat('ko-KR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Seoul',
    year: 'numeric'
  }).formatToParts(new Date())
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find(part => part.type === type)?.value || ''

  return `${getPart('year')}-${getPart('month')}-${getPart('day')}`
}

const getDailyFortune = (seed: string) => pickDailyItem(dailyFortunes, seed)

const getSignedNumberLabel = (value: number) =>
  value > 0 ? `+${value}` : `${value}`

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

const getLuckyEquipment = (equipmentData: Equipment[], seed: string) => {
  const namedEquipment = equipmentData.filter(equipment => equipment.item_name)

  if (namedEquipment.length === 0) {
    return null
  }

  return namedEquipment[getStableHash(seed) % namedEquipment.length]
}

export default function CharacterDailyReport({ ocid }: Props) {
  const { basicData, status: basicStatus } = useCharacterBasic(ocid)
  const { equipmentData, status: equipmentStatus } = useEquipment(ocid)
  const { beautyData, cashData, status: cashStatus } = useCashEquipment(ocid)
  const [nicknameStyle, setNicknameStyle] = useState<NicknameStyle>('random')
  const status = getReportStatus(basicStatus, equipmentStatus, cashStatus)
  const activeCashItems = getActiveCashItems(cashData)
  const level = basicData.character_level || 0
  const totalStarforce = equipmentData.reduce(
    (total, item) => total + getStarforce(item.starforce),
    0
  )
  const baseReportScore = getReportScore({
    activeCashItemCount: activeCashItems.length,
    equipmentCount: equipmentData.length,
    level,
    totalStarforce
  })
  const dailyDateKey = getKoreanDateKey()
  const dailyFortune = useMemo(
    () =>
      getDailyFortune(
        `${dailyDateKey}:${ocid || basicData.character_name || 'guest'}`
      ),
    [basicData.character_name, dailyDateKey, ocid]
  )
  const reportScore =
    status === 'loading'
      ? baseReportScore
      : Math.min(100, Math.max(0, baseReportScore + dailyFortune.boost))
  const reportScoreWidth = `${reportScore}%`
  const luckyEquipment = getLuckyEquipment(
    equipmentData,
    `${dailyDateKey}:${dailyFortune.label}:${ocid || basicData.character_name || 'guest'}`
  )
  const luckyTime = pickDailyItem(
    luckyTimes,
    `${dailyDateKey}:time:${ocid || basicData.character_name || 'guest'}`
  )
  const luckyKeyword = pickDailyItem(
    luckyKeywords,
    `${dailyDateKey}:keyword:${ocid || basicData.character_name || 'guest'}`
  )
  const cautionPoint = pickDailyItem(
    cautionPoints,
    `${dailyDateKey}:caution:${ocid || basicData.character_name || 'guest'}`
  )
  const luckyEquipmentMessageTemplate = pickDailyItem(
    luckyEquipmentMessages,
    `${dailyDateKey}:equipment-message:${ocid || basicData.character_name || 'guest'}`
  )
  const codyPointMessageTemplate = pickDailyItem(
    codyPointMessages,
    `${dailyDateKey}:cody-message:${ocid || basicData.character_name || 'guest'}`
  )
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
        : `${getLevelMood(level)}입니다. 오늘 운세는 ${dailyFortune.label}. ${dailyFortune.message}`
  const generatedNicknames = useMemo(
    () =>
      generateCharacterNicknames({
        basic: basicData,
        cashItems: activeCashItems,
        equipment: equipmentData,
        style: nicknameStyle
      }),
    [activeCashItems, basicData, equipmentData, nicknameStyle]
  )
  const highlights: ReportHighlight[] = [
    {
      description: luckyEquipment
        ? formatDailyReportTemplate(luckyEquipmentMessageTemplate, {
            fortune: dailyFortune.label,
            item: luckyEquipment.item_name || '행운 장비'
          })
        : '장비 데이터를 불러오면 오늘의 행운 장비가 표시됩니다.',
      icon: Sparkles,
      label: '오늘의 행운 장비',
      tone: 'border-amber-200 bg-amber-50/75 text-amber-800 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100',
      value: luckyEquipment?.item_name || '행운 장비 대기'
    },
    {
      description: beautyData
        ? formatDailyReportTemplate(codyPointMessageTemplate, {
            hair: beautyData.character_hair.hair_name || '오늘의 헤어'
          })
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
        <div className="bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(255,251,235,0.88)_48%,rgba(248,250,252,0.95))] p-5 dark:bg-[linear-gradient(135deg,rgba(6,78,59,0.35),rgba(68,64,60,0.24)_48%,rgba(15,23,42,0.98))]">
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
                  {status !== 'loading' && (
                    <p className="mt-1 text-xs font-bold text-muted-foreground">
                      기본 {baseReportScore}점 → 운세 적용 {reportScore}점
                    </p>
                  )}
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
              <div
                className={`mt-3 rounded-lg border px-3 py-2 ${dailyFortune.tone}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-1.5 text-xs font-black">
                    <Sparkles className="h-3.5 w-3.5" />
                    오늘 운세
                  </p>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-black text-current shadow-sm dark:bg-white/10">
                    준비도 {getSignedNumberLabel(dailyFortune.boost)}
                  </span>
                </div>
                <p className="mt-1 text-sm font-black">{dailyFortune.label}</p>
                <p className="mt-1 text-xs font-bold leading-5 opacity-80">
                  {dailyFortune.message}
                </p>
                <p className="mt-2 rounded-md bg-white/55 px-2 py-1 text-xs font-black leading-5 opacity-90 dark:bg-white/10">
                  {dailyFortune.scoreHint}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-border bg-background/55 p-4 dark:bg-white/[0.025] md:grid-cols-3">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm dark:border-emerald-300/20 dark:bg-emerald-400/10">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black text-emerald-700 dark:text-emerald-100">
                행운 시간
              </p>
              <Clock3 className="h-4 w-4 text-emerald-600 dark:text-emerald-200" />
            </div>
            <p className="mt-2 text-lg font-black text-foreground">
              {luckyTime}
            </p>
            <p className="mt-1 text-xs font-bold leading-5 text-muted-foreground">
              무언가 하나를 시작하기 좋은 리듬입니다.
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 shadow-sm dark:border-amber-300/20 dark:bg-amber-400/10">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black text-amber-700 dark:text-amber-100">
                행운 키워드
              </p>
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-200" />
            </div>
            <p className="mt-2 text-lg font-black text-foreground">
              {luckyKeyword}
            </p>
            <p className="mt-1 text-xs font-bold leading-5 text-muted-foreground">
              오늘 리포트가 고른 작은 힌트예요.
            </p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-sky-50/70 p-4 shadow-sm dark:border-sky-300/20 dark:bg-sky-400/10">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black text-sky-700 dark:text-sky-100">
                오늘의 조심 포인트
              </p>
              <Compass className="h-4 w-4 text-sky-600 dark:text-sky-200" />
            </div>
            <p className="mt-2 text-lg font-black text-foreground">
              {cautionPoint.title}
            </p>
            <p className="mt-1 text-xs font-bold leading-5 text-muted-foreground">
              {cautionPoint.description}
            </p>
          </div>
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
                : dailyFortune.headline}
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm font-bold text-foreground dark:bg-white/[0.04]">
            <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            {status === 'loading'
              ? '오늘의 추천 행동을 고르고 있어요.'
              : dailyFortune.action}
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

      <section className="rounded-lg border border-pink-200 bg-pink-50/55 p-5 shadow-sm dark:border-pink-300/20 dark:bg-pink-400/10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-black text-pink-700 dark:text-pink-200">
              <Sparkles className="h-4 w-4" />
              캐릭터 별명 생성기
            </p>
            <h3 className="mt-2 text-2xl font-black text-foreground">
              AI 없이 데이터로 만든 별명
            </h3>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              직업, 레벨, 장비, 코디 아이템을 조합해 가볍게 즐길 수 있는 별명을
              만듭니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {nicknameStyles.map(style => (
              <button
                key={style}
                type="button"
                onClick={() => setNicknameStyle(style)}
                className={`rounded-lg border px-3 py-2 text-xs font-black transition ${
                  nicknameStyle === style
                    ? 'border-pink-400 bg-white text-pink-700 shadow-sm dark:border-pink-300 dark:bg-white/10 dark:text-pink-100'
                    : 'border-pink-200 bg-white/60 text-muted-foreground hover:border-pink-300 hover:text-foreground dark:border-pink-300/20 dark:bg-white/5'
                }`}>
                {getNicknameStyleLabel(style)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {status === 'loading'
            ? Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-lg border border-pink-100 bg-white/60 dark:border-pink-300/10 dark:bg-white/5"
                />
              ))
            : generatedNicknames.map((nickname, index) => (
                <article
                  key={`${nickname.title}-${index}`}
                  className="rounded-lg border border-pink-100 bg-white/80 p-4 shadow-sm dark:border-pink-300/15 dark:bg-white/[0.06]">
                  <span className="rounded-md bg-pink-100 px-2 py-1 text-[11px] font-black text-pink-700 dark:bg-pink-300/15 dark:text-pink-100">
                    {getNicknameStyleLabel(nickname.style)}
                  </span>
                  <h4 className="mt-3 min-h-12 text-base font-black leading-6 text-foreground">
                    {nickname.title}
                  </h4>
                  <p className="mt-2 text-xs font-medium leading-5 text-muted-foreground">
                    {nickname.description}
                  </p>
                </article>
              ))}
        </div>
      </section>
    </section>
  )
}
