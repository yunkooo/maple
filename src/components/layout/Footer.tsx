import github from '@/asset/github-mark.svg'

export default function Footer() {
  return (
    <footer className="mx-auto mt-10 w-full max-w-6xl border-t border-border px-4 py-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
      <a
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
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
