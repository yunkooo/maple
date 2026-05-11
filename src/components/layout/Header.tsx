import { Moon, Search, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme) {
      return savedTheme === 'dark'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement

    root.classList.toggle('dark', isDarkMode)
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inputRef.current) {
      const nickName = inputRef.current.value.trim()

      if (!nickName) {
        return
      }

      navigate(`/${nickName}`)
    }
  }

  return (
    <header className="sticky top-0 z-20 -mx-4 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <Link
          className="shrink-0 text-xl font-black tracking-normal text-foreground sm:text-2xl"
          to="/">
          MAPLE
        </Link>
        <form
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm transition-colors focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/15"
          onSubmit={handleSubmit}>
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            type="text"
            ref={inputRef}
            placeholder="캐릭터 닉네임 검색"
          />
          <button
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            type="submit">
            <Search className="h-4 w-4" />
            <span className="sr-only">검색</span>
          </button>
        </form>
        <button
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground"
          type="button"
          aria-label={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
          onClick={() => setIsDarkMode(currentMode => !currentMode)}>
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  )
}
