import iconUrl from '@/assets/icon.svg'
import { Bell, Moon, Search, Sun, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

type NavigationItem = {
  icon: typeof UserRound
  label: string
  to: string
}

const LAST_NICKNAME_STORAGE_KEY = 'maple:lastNickname'

const getStoredNickname = () => {
  try {
    return localStorage.getItem(LAST_NICKNAME_STORAGE_KEY)?.trim() || ''
  } catch {
    return ''
  }
}

const setStoredNickname = (nickname: string) => {
  try {
    localStorage.setItem(LAST_NICKNAME_STORAGE_KEY, nickname)
  } catch {
    // 검색 유지 기능은 저장소 접근이 막혀도 화면 동작을 방해하지 않습니다.
  }
}

const getRouteNickname = (pathname: string, search: string) => {
  const searchParams = new URLSearchParams(search)
  const nicknameParam = searchParams.get('nickname')?.trim()

  if (nicknameParam) {
    return nicknameParam
  }

  const reportMatch = pathname.match(/^\/report\/([^/]+)$/)

  if (reportMatch) {
    return decodeURIComponent(reportMatch[1])
  }

  const characterMatch = pathname.match(/^\/([^/]+)$/)
  const reservedPaths = new Set(['notice', 'report', 'cody'])

  if (characterMatch && !reservedPaths.has(characterMatch[1])) {
    return decodeURIComponent(characterMatch[1])
  }

  return ''
}

const getNavigationItems = (nickname: string): NavigationItem[] => {
  const encodedNickname = encodeURIComponent(nickname)

  return [
    {
      label: '캐릭터',
      to: nickname ? `/${encodedNickname}` : '/',
      icon: UserRound
    },
    { label: '공지', to: '/notice', icon: Bell }
  ]
}

export const getSearchTargetPath = (pathname: string, nickname: string) => {
  const encodedNickname = encodeURIComponent(nickname)

  if (pathname === '/cody') {
    return `/cody?nickname=${encodedNickname}`
  }

  if (pathname === '/report' || pathname.startsWith('/report/')) {
    return `/report/${encodedNickname}`
  }

  return `/${encodedNickname}`
}

export default function Header() {
  const inputRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const routeNickname = getRouteNickname(location.pathname, location.search)
  const [lastNickname, setLastNickname] = useState(() => getStoredNickname())
  const currentNickname = routeNickname || lastNickname
  const navigationItems = getNavigationItems(currentNickname)
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

  useEffect(() => {
    if (!routeNickname) {
      return
    }

    setLastNickname(routeNickname)
    setStoredNickname(routeNickname)
  }, [routeNickname])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = currentNickname
    }
  }, [currentNickname])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inputRef.current) {
      const nickName = inputRef.current.value.trim()

      if (!nickName) {
        return
      }

      setLastNickname(nickName)
      setStoredNickname(nickName)
      navigate(getSearchTargetPath(location.pathname, nickName))
    }
  }

  return (
    <header className="sticky top-0 z-20 -mx-4 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-[92rem] flex-col gap-3 lg:flex-row lg:items-center">
        <Link
          className="flex shrink-0 items-center gap-2 text-xl font-black tracking-normal text-foreground sm:text-2xl"
          to="/">
          <img
            className="h-10 w-10 rounded-lg"
            src={iconUrl}
            alt=""
          />
          <span className="leading-none">Maple Note</span>
        </Link>
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:justify-center">
          {navigationItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              className={({ isActive }) =>
                `inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors hover:bg-accent hover:text-foreground ${
                  isActive
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground'
                }`
              }
              key={label}
              to={to}
              end={to === '/'}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <form
          className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 lg:w-72"
          onSubmit={handleSubmit}>
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            type="text"
            ref={inputRef}
            defaultValue={currentNickname}
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
