import dailyReportFortuneData from '@/data/dailyReportFortune.json'

export type DailyFortuneToneKey =
  | 'amber'
  | 'emerald'
  | 'lime'
  | 'pink'
  | 'sky'
  | 'violet'

export type DailyFortune = {
  action: string
  boost: number
  headline: string
  label: string
  message: string
  scoreHint: string
  tone: string
  toneKey: DailyFortuneToneKey
}

export type DailyCautionPoint = {
  description: string
  title: string
}

type DailyFortuneData = {
  cautionPoints: DailyCautionPoint[]
  codyPointMessages: string[]
  fortunes: Array<Omit<DailyFortune, 'tone'>>
  luckyEquipmentMessages: string[]
  luckyKeywords: string[]
  luckyTimes: string[]
}

const fortuneToneByKey: Record<DailyFortuneToneKey, string> = {
  amber:
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100',
  emerald:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100',
  lime: 'border-lime-200 bg-lime-50 text-lime-800 dark:border-lime-300/20 dark:bg-lime-400/10 dark:text-lime-100',
  pink: 'border-pink-200 bg-pink-50 text-pink-800 dark:border-pink-300/20 dark:bg-pink-400/10 dark:text-pink-100',
  sky: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-100',
  violet:
    'border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-300/20 dark:bg-violet-400/10 dark:text-violet-100'
}

const typedDailyReportFortuneData = dailyReportFortuneData as DailyFortuneData

export const dailyFortunes: DailyFortune[] =
  typedDailyReportFortuneData.fortunes.map(fortune => ({
    ...fortune,
    tone: fortuneToneByKey[fortune.toneKey]
  }))

export const luckyTimes = typedDailyReportFortuneData.luckyTimes
export const luckyKeywords = typedDailyReportFortuneData.luckyKeywords
export const cautionPoints = typedDailyReportFortuneData.cautionPoints
export const luckyEquipmentMessages =
  typedDailyReportFortuneData.luckyEquipmentMessages
export const codyPointMessages = typedDailyReportFortuneData.codyPointMessages

export const getStableHash = (value: string) =>
  [...value].reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0
  }, 0)

export const pickDailyItem = <T>(items: T[], seed: string) =>
  items[getStableHash(seed) % items.length]

export const formatDailyReportTemplate = (
  template: string,
  values: Record<string, string>
) =>
  Object.entries(values).reduce(
    (formattedTemplate, [key, value]) =>
      formattedTemplate.split(`{${key}}`).join(value),
    template
  )
