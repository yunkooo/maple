import { useCharacterBasic } from '@/hooks/useCharacterBasic'
import { BadgeCheck, Shield, Sparkles, Swords } from 'lucide-react'
import CashEquipmentSummary from './CashEquipmentSummary'

type Props = {
  ocid: string | undefined
}

export default function CharacterProfile({ ocid = '' }: Props) {
  const { basicData, status } = useCharacterBasic(ocid)
  const expRate = Number.parseFloat(basicData.character_exp_rate || '0')
  const expWidth = `${Math.min(Math.max(expRate, 0), 100)}%`
  const displayDate = basicData.date ? basicData.date.split('T')[0] : '-'

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <header className="sr-only">캐릭터 기본 정보</header>
      <div className="grid gap-6 bg-[radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.16),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.04),transparent)] p-5 dark:bg-[radial-gradient(circle_at_78%_8%,rgba(45,212,191,0.18),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(24,24,27,0.96))] md:grid-cols-[220px_1fr_280px] md:items-center md:p-6">
        <div className="flex min-h-[190px] items-end justify-center rounded-lg border border-border/70 bg-background/70 p-4 dark:bg-white/5">
          {basicData.character_image ? (
            <img
              className="h-36 w-36 object-contain drop-shadow-[0_16px_24px_rgba(15,23,42,0.22)]"
              src={basicData.character_image}
              alt={basicData.character_name}
            />
          ) : (
            <div className="flex h-36 w-36 items-center justify-center rounded-lg border border-dashed border-border text-xs font-semibold text-muted-foreground">
              {status === 'loading' ? 'LOADING' : 'NO IMAGE'}
            </div>
          )}
        </div>
        <div className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/60 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
              <BadgeCheck className="h-3.5 w-3.5" />
              {status === 'loading' ? '조회중' : basicData.world_name || '월드'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              {basicData.character_class || '직업'}
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="truncate text-3xl font-black tracking-normal text-foreground sm:text-4xl">
              {status === 'loading'
                ? '불러오는 중'
                : basicData.character_name || '캐릭터'}
            </h1>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>Lv.{basicData.character_level || '-'}</span>
              <span>{basicData.character_class_level || '전직 정보 없음'}</span>
              <span>길드 {basicData.character_guild_name || '-'}</span>
              <span>{basicData.character_gender || '-'}</span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border/70 bg-background/70 p-3 dark:bg-white/5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Swords className="h-3.5 w-3.5" />
                전투 지표
              </div>
              <p className="mt-1 text-lg font-bold">
                {status === 'error' ? '조회 실패' : '분석 준비중'}
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-background/70 p-3 dark:bg-white/5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                길드
              </div>
              <p className="mt-1 truncate text-lg font-bold">
                {basicData.character_guild_name || '-'}
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-background/70 p-3 dark:bg-white/5">
              <div className="text-xs text-muted-foreground">기준일</div>
              <p className="mt-1 text-lg font-bold">{displayDate}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>경험치</span>
              <span>{basicData.character_exp_rate || '0'}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300"
                style={{ width: expWidth }}></div>
            </div>
          </div>
        </div>
        <CashEquipmentSummary ocid={ocid} />
      </div>
    </section>
  )
}
