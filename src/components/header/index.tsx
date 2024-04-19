import Moon from '@/asset/moon_icon.svg'
import glass from '@/asset/magnifying_glass_icon.svg'
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const inputRef = useRef<HTMLInputElement>(null)

  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inputRef.current) {
      const nickName = inputRef.current.value
      navigate(`/${nickName}`)
    }
  }

  return (
    <header className="flex justify-center items-center gap-x-4 py-4">
      <Link
        className="text-2xl font-bold"
        to="/">
        MAPLE
      </Link>
      <form
        className="flex-1 flex border-2 px-2 rounded shadow-md"
        onSubmit={handleSubmit}>
        <input
          className="outline-none flex-1"
          type="text"
          ref={inputRef}
          placeholder="닉네임"
        />
        <button
          className="w-4"
          type="submit">
          <img
            className="h-5"
            src={glass}
          />
        </button>
      </form>
      <button>
        <img
          className="h-6"
          src={Moon}
        />
      </button>
    </header>
  )
}
