import github from '@/asset/github-mark.svg'

export default function Footer() {
  return (
    <footer className="text-slate-400	text-sm text-center">
      <a
        className="inline-block"
        href="https://github.com/yunkooo"
        target="_blank"
        rel="noreferrer">
        <img
          className="h-9"
          src={github}
        />
      </a>
      <p>
        This site is not associated with NEXON Korea. Data sourced from NEXON
        OpenAPI.
      </p>
      <p>문의: yunkoooooo@gmail.com</p>
    </footer>
  )
}
