import CharacterDailyReport from '@/components/character/CharacterDailyReport'
import { useCharacterOcid } from '@/hooks/useCharacterOcid'
import { Sparkles } from 'lucide-react'
import { useParams } from 'react-router-dom'

export default function DailyReportPage() {
  const { nickname } = useParams()
  const decodedNickname = nickname ? decodeURIComponent(nickname) : ''
  const { errorMessage, ocid, status } = useCharacterOcid(decodedNickname)

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-emerald-200/70 bg-card p-5 shadow-sm dark:border-emerald-300/15">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-2 text-sm font-black text-emerald-700 dark:text-emerald-200">
            <Sparkles className="h-4 w-4" />
            오늘의 캐릭터 리포트
          </p>
          <h1 className="text-3xl font-black tracking-normal text-foreground">
            {decodedNickname
              ? `${decodedNickname}님의 오늘 볼 내용`
              : '상단 검색창에서 캐릭터를 먼저 검색하세요'}
          </h1>
          <p className="max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
            캐릭터 기본 정보, 장비, 코디 데이터를 묶어 오늘 점검하기 좋은 항목을
            가볍게 정리합니다.
          </p>
        </div>
      </div>

      {status === 'loading' ? (
        <div className="rounded-lg border border-border bg-card px-4 py-5 text-sm font-medium text-muted-foreground shadow-sm">
          캐릭터 정보를 확인하는 중입니다.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {ocid ? <CharacterDailyReport ocid={ocid} /> : null}
    </section>
  )
}
