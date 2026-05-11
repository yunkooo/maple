import { useCharacterBasic } from '@/hooks/useCharacterBasic'
import { useGuildMark } from '@/hooks/useGuildMark'
import { CalendarDays, Shield, Sparkles, Trophy } from 'lucide-react'
import CashEquipmentSummary from './CashEquipmentSummary'

type Props = {
  ocid: string | undefined
}

type SummaryItem = {
  imageUrl?: string
  label: string
  value: string
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
  const guildMarkUrl = useGuildMark({
    date: displayDate,
    guildName: basicData.character_guild_name,
    worldName: basicData.world_name
  })
  const levelText = basicData.character_level
    ? `Lv.${basicData.character_level}`
    : '레벨 정보 없음'
  const expText = basicData.character_exp_rate
    ? `${basicData.character_exp_rate}%`
    : '0%'
  const summaryItems: SummaryItem[] = [
    { label: '월드', value: worldName },
    { label: '직업', value: className },
    { label: '레벨', value: levelText },
    { imageUrl: guildMarkUrl, label: '길드', value: guildName }
  ]

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <header className="sr-only">캐릭터 기본 정보</header>
      <div className="grid gap-6 bg-muted/20 p-5 dark:bg-white/[0.025] md:grid-cols-[minmax(260px,320px)_1fr_280px] md:items-center md:p-6">
        <div className="relative flex min-h-[340px] items-end justify-center overflow-hidden rounded-lg border border-border bg-background p-4 shadow-inner dark:bg-white/[0.035] md:min-h-[390px]">
          <div className="relative z-10 flex h-80 w-80 items-center justify-center sm:h-96 sm:w-96">
            {basicData.character_image ? (
              <img
                className="h-72 w-72 scale-[1.68] object-contain drop-shadow-[0_24px_32px_rgba(15,23,42,0.24)] [image-rendering:pixelated] sm:h-80 sm:w-80 md:scale-[1.62]"
                src={basicData.character_image}
                alt={basicData.character_name || '캐릭터 이미지'}
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm font-bold text-muted-foreground dark:bg-white/5">
                {status === 'loading' ? '이미지 조회 중' : '이미지 없음'}
              </div>
            )}
          </div>
        </div>
        <div className="min-w-0 space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/60 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                {className}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-muted-foreground dark:bg-white/5">
                <Trophy className="h-3.5 w-3.5" />
                {levelText}
              </span>
            </div>
            <h1 className="truncate text-4xl font-black tracking-normal text-foreground sm:text-5xl">
              {characterName}
            </h1>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {summaryItems.map(item => (
              <div
                className="rounded-lg border border-border bg-background/80 p-3 shadow-sm dark:bg-white/[0.04]"
                key={item.label}>
                <div className="flex min-w-0 items-center gap-3">
                  {item.imageUrl ? (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background shadow-sm dark:bg-white/10">
                      <img
                        alt={`${item.value} 길드 마크`}
                        className="h-8 w-8 object-contain [image-rendering:pixelated]"
                        decoding="async"
                        loading="lazy"
                        src={item.imageUrl}
                      />
                    </span>
                  ) : null}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 truncate text-base font-black text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-background/80 p-4 shadow-sm dark:bg-white/[0.04]">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex items-center gap-2 font-black text-foreground">
                <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                다음 레벨 경험치
              </span>
              <span className="font-black text-emerald-700 dark:text-emerald-200">
                {expText}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted shadow-inner dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.22)]"
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
