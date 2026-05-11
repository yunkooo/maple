import github from '@/assets/github-mark.svg'

export default function Footer() {
  return (
    <footer className="mx-auto mt-12 w-full max-w-[92rem] px-4 pb-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card/80 px-5 py-4 text-center text-xs font-semibold text-muted-foreground shadow-sm sm:flex-row sm:text-left">
        <div className="space-y-1">
          <p>
            This site is not associated with NEXON Korea. Data sourced from
            NEXON OpenAPI.
          </p>
          <p>문의: yunkoooooo@gmail.com</p>
        </div>
        <a
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background transition hover:border-emerald-300 hover:bg-emerald-50 dark:hover:border-emerald-400/40 dark:hover:bg-emerald-400/10"
          href="https://github.com/yunkooo"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub">
          <img
            className="h-7"
            src={github}
            alt=""
          />
        </a>
      </div>
    </footer>
  )
}
