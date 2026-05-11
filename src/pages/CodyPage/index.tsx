import CodySection from '@/components/character/CodySection'
import { useCharacterOcid } from '@/hooks/useCharacterOcid'
import { Shirt } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

export default function CodyPage() {
  const [searchParams] = useSearchParams()
  const nickname = searchParams.get('nickname')?.trim() || ''
  const { errorMessage, ocid, status } = useCharacterOcid(nickname)

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <Shirt className="h-4 w-4" />
            코디 조회
          </div>
          <h1 className="text-2xl font-black tracking-normal text-foreground sm:text-3xl">
            {nickname ? `${nickname}님의 코디` : '캐릭터를 먼저 검색하세요'}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            캐시 장비와 뷰티 정보를 확인할 수 있습니다.
          </p>
        </div>
      </section>

      {status === 'loading' && (
        <div className="rounded-lg border border-border bg-card p-4 text-sm font-medium text-muted-foreground shadow-sm">
          캐릭터 정보를 불러오는 중입니다.
        </div>
      )}

      {errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {errorMessage}
        </div>
      )}

      {ocid && (
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <CodySection ocid={ocid} />
        </section>
      )}
    </div>
  )
}
