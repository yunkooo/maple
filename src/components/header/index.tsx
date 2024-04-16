import Moon from '@/asset/moon_icon.svg'
import glass from '@/asset/magnifying_glass_icon.svg'

export default function Header() {
  return (
    <header className="flex justify-center items-center gap-x-4 py-4">
      <p className="text-2xl">MAPLE</p>
      <form className="flex-1 flex border-2 px-2 rounded shadow-md">
        <input className="outline-none flex-1" />
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
