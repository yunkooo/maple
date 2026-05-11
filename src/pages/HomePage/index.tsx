import { ArrowRight, Search } from 'lucide-react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nickname = inputRef.current?.value.trim()

    if (!nickname) {
      return
    }

    navigate(`/${encodeURIComponent(nickname)}`)
  }

  return (
    <section
      id="character-search"
      className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="flex flex-col justify-center gap-5">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            메이플 캐릭터 조회
          </p>
          <h1 className="text-3xl font-black tracking-normal text-foreground sm:text-4xl">
            캐릭터 닉네임 하나로 필요한 정보를 이어서 확인하세요
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            닉네임을 입력하면 캐릭터, 오늘 리포트, 코디 화면이 같은 캐릭터를
            기준으로 이어집니다.
          </p>
        </div>

        <form
          className="flex flex-col gap-3 rounded-lg border border-border bg-background p-3 shadow-sm sm:flex-row"
          onSubmit={handleSubmit}>
          <label
            className="sr-only"
            htmlFor="home-character-search">
            캐릭터 닉네임
          </label>
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-md bg-muted px-3 py-3">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              id="home-character-search"
              ref={inputRef}
              className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              type="text"
              placeholder="캐릭터 닉네임을 입력하세요"
            />
          </div>
          <button
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            type="submit">
            조회하기
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  )
}
