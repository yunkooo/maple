import { useCharacterOcid } from '@/hooks/useCharacterOcid'
import { useCharacterBasic } from '@/hooks/useCharacterBasic'
import { Link, useParams } from 'react-router-dom'
import { AlertCircle, Loader2, Search, UserX } from 'lucide-react'
import {
  shouldShowCharacterLookupPending,
  shouldShowCharacterNotFoundFallback
} from './characterInfo.utils'
import CharacterProfile from './CharacterProfile'
import CharacterTabs from './CharacterTabs'

type CharacterNotFoundFallbackProps = {
  errorMessage?: string
  isLoading?: boolean
  nickname?: string
}

function CharacterNotFoundFallback({
  errorMessage,
  isLoading = false,
  nickname
}: CharacterNotFoundFallbackProps) {
  const displayNickname = nickname?.trim() || '입력한 캐릭터'

  if (isLoading) {
    return <CharacterLookupLoadingFallback nickname={nickname} />
  }

  return (
    <section className="rounded-lg border border-rose-200 bg-card p-5 shadow-sm dark:border-rose-300/20">
      <header className="sr-only">캐릭터 조회 실패</header>
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-4">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-200">
              <UserX className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-black text-rose-600 dark:text-rose-200">
                캐릭터를 찾을 수 없습니다
              </p>
              <h1 className="mt-1 truncate text-3xl font-black text-foreground sm:text-4xl">
                {displayNickname}
              </h1>
            </div>
          </div>

          <p className="max-w-3xl text-sm font-medium leading-6 text-muted-foreground">
            입력한 닉네임으로 캐릭터 정보를 불러오지 못했습니다. 닉네임 철자와
            최근 닉네임 변경 여부를 확인한 뒤 다시 검색해주세요.
          </p>

          {errorMessage && (
            <div className="flex gap-2 rounded-lg border border-rose-200 bg-rose-50/70 px-3 py-3 text-sm font-bold text-rose-700 dark:border-rose-300/20 dark:bg-rose-400/10 dark:text-rose-100">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <Link
          to="/"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-black text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          <Search className="h-4 w-4" />
          다시 검색하기
        </Link>
      </div>
    </section>
  )
}

type CharacterLookupLoadingFallbackProps = {
  nickname?: string
}

function CharacterLookupLoadingFallback({
  nickname
}: CharacterLookupLoadingFallbackProps) {
  const displayNickname = nickname?.trim() || '캐릭터'

  return (
    <section className="rounded-lg border border-emerald-200 bg-card p-5 shadow-sm dark:border-emerald-300/20">
      <header className="sr-only">캐릭터 조회 중</header>
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
            <Loader2 className="h-6 w-6 animate-spin" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-black text-emerald-700 dark:text-emerald-200">
              캐릭터 정보를 확인하는 중입니다
            </p>
            <h1 className="mt-1 truncate text-3xl font-black text-foreground sm:text-4xl">
              {displayNickname}
            </h1>
          </div>
        </div>

        <p className="max-w-3xl text-sm font-medium leading-6 text-muted-foreground">
          입력한 닉네임으로 캐릭터 기본 정보를 불러오고 있습니다.
        </p>

        <div className="relative h-2 overflow-hidden rounded-full bg-muted shadow-inner dark:bg-slate-800">
          <div className="character-lookup-progress-bar absolute inset-y-0 w-1/2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.45)]" />
        </div>
      </div>
    </section>
  )
}

export default function CharacterInfo() {
  const { nickname } = useParams()
  const { errorMessage, ocid, status } = useCharacterOcid(nickname)
  const { basicData, status: basicStatus } = useCharacterBasic(ocid)
  const showLookupPending = shouldShowCharacterLookupPending({
    basicStatus,
    nickname,
    ocid,
    status
  })
  const showNotFoundFallback = shouldShowCharacterNotFoundFallback({
    basicData,
    basicStatus,
    errorMessage,
    nickname,
    ocid,
    status
  })

  return (
    <div className="space-y-5">
      {showLookupPending ? (
        <CharacterNotFoundFallback
          isLoading
          nickname={nickname}
        />
      ) : showNotFoundFallback ? (
        <CharacterNotFoundFallback
          errorMessage={errorMessage}
          nickname={nickname}
        />
      ) : (
        <>
          <CharacterProfile
            basicData={basicData}
            ocid={ocid}
            status={basicStatus}
          />
          <CharacterTabs ocid={ocid} />
        </>
      )}
    </div>
  )
}
