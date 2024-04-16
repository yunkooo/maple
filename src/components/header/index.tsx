import Moon from '@/asset/moon_icon.svg'
import glass from '@/asset/magnifying_glass_icon.svg'
import { useState } from 'react'
import { getChar, getOcid } from '@/api/charactor'
import { getDate } from '@/utils/getDate'

export default function Header() {
  const [charName, setCharName] = useState<string>('')

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setCharName(event.currentTarget.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { ocid }: any = await getOcid(charName)
    const info: any = await getChar(ocid, getDate())
  }
  return (
    <header className="flex justify-center items-center gap-x-4 py-4">
      <p className="text-2xl font-bold">MAPLE</p>
      <form
        className="flex-1 flex border-2 px-2 rounded shadow-md"
        onSubmit={handleSubmit}>
        <input
          className="outline-none flex-1"
          onChange={handleChange}
          type="text"
          value={charName}
          placeholder="닉네임"
        />
        <button
          className="p-2"
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
