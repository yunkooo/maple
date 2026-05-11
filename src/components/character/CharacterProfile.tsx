import { useCharacterBasic } from '@/hooks/useCharacterBasic'
import {
  BadgeCheck,
  CalendarDays,
  Shield,
  Sparkles,
  Trophy
} from 'lucide-react'
import CashEquipmentSummary from './CashEquipmentSummary'

type Props = {
  ocid: string | undefined
}

export default function CharacterProfile({ ocid = '' }: Props) {
  const { basicData, status } = useCharacterBasic(ocid)
  const expRate = Number.parseFloat(basicData.character_exp_rate || '0')
  const expWidth = `${Math.min(Math.max(expRate, 0), 100)}%`
  const displayDate = basicData.date ? basicData.date.split('T')[0] : '-'
  const characterName =
    status === 'loading'
      ? '캐릭터 조회 중'
      : basicData.character_name || '캐릭터'
  const worldName = basicData.world_name || '월드 정보 없음'
  const className = basicData.character_class || '직업 정보 없음'
  const guildName = basicData.character_guild_name || '소속 길드 없음'
  const levelText = basicData.character_level
    ? `Lv.${basicData.character_level}`
    : '레벨 정보 없음'
  const expText = basicData.character_exp_rate
    ? `${basicData.character_exp_rate}%`
    : '0%'
  const summaryItems = [
    ['월드', worldName],
    ['직업', className],
    ['레벨', levelText],
    ['길드', guildName],
    ['기준일', displayDate],
    ['성별', basicData.character_gender || '-']
  ]

  return (
    <section className="overflow-hidden rounded-lg border border-amber-200/70 bg-card shadow-sm dark:border-amber-300/15">
      <header className="sr-only">캐릭터 기본 정보</header>
      <div className="grid gap-6 bg-[radial-gradient(circle_at_16%_12%,rgba(251,191,36,0.3),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(20,184,166,0.2),transparent_34%),linear-gradient(135deg,rgba(255,251,235,0.92),rgba(240,253,244,0.58)_48%,rgba(255,255,255,0.88))] p-5 dark:bg-[radial-gradient(circle_at_18%_8%,rgba(251,191,36,0.18),transparent_30%),radial-gradient(circle_at_84%_14%,rgba(45,212,191,0.17),transparent_34%),linear-gradient(135deg,rgba(28,25,23,0.98),rgba(17,24,39,0.94)_48%,rgba(15,23,42,0.98))] md:grid-cols-[minmax(260px,320px)_1fr_280px] md:items-center md:p-6">
        <div className="relative flex min-h-[280px] items-end justify-center overflow-hidden rounded-lg border border-amber-200/80 bg-gradient-to-b from-sky-100/90 via-emerald-50/90 to-amber-100/90 p-4 shadow-inner dark:border-amber-300/15 dark:from-slate-900/80 dark:via-emerald-950/40 dark:to-stone-900/90 md:min-h-[320px]">
          <div className="absolute bottom-7 h-10 w-48 rounded-full bg-amber-300/45 blur-sm dark:bg-amber-300/20" />
          <div className="absolute bottom-9 h-4 w-40 rounded-full border border-amber-300/70 bg-white/55 dark:border-amber-200/20 dark:bg-white/10" />
          <div className="relative z-10 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
            {basicData.character_image ? (
              <img
                className="h-56 w-56 scale-[1.45] object-contain drop-shadow-[0_22px_30px_rgba(15,23,42,0.28)] [image-rendering:pixelated] sm:h-60 sm:w-60 md:scale-[1.38]"
                src={basicData.character_image}
                alt={basicData.character_name || '캐릭터 이미지'}
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-dashed border-amber-300/70 bg-white/50 text-sm font-bold text-muted-foreground dark:bg-white/5">
                {status === 'loading' ? '이미지 조회 중' : '이미지 없음'}
              </div>
            )}
          </div>
          <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-white/80 px-3 py-1 text-xs font-bold text-amber-800 shadow-sm dark:border-amber-300/20 dark:bg-white/10 dark:text-amber-100">
            <BadgeCheck className="h-3.5 w-3.5" />
            {status === 'error' ? '조회 실패' : worldName}
          </div>
        </div>
        <div className="min-w-0 space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/60 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                {className}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                <Trophy className="h-3.5 w-3.5" />
                {levelText}
              </span>
            </div>
            <h1 className="truncate text-4xl font-black tracking-normal text-foreground sm:text-5xl">
              {characterName}
            </h1>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {summaryItems.map(([label, value]) => (
              <div
                className="rounded-lg border border-white/70 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.06]"
                key={label}>
                <p className="text-xs font-bold text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 truncate text-base font-black text-foreground">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-white/70 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex items-center gap-2 font-black text-foreground">
                <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                다음 레벨 경험치
              </span>
              <span className="font-black text-amber-700 dark:text-amber-200">
                {expText}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-amber-100 shadow-inner dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 shadow-[0_0_12px_rgba(16,185,129,0.32)]"
                style={{ width: expWidth }}></div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              {displayDate} 기준 캐릭터 기본 정보
            </div>
          </div>
        </div>
        <CashEquipmentSummary ocid={ocid} />
      </div>
    </section>
  )
}
