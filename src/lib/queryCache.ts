const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

export const queryCacheTime = {
  characterDailyData: {
    gcTime: DAY_MS,
    staleTime: 6 * HOUR_MS
  },
  guildMark: {
    gcTime: DAY_MS,
    staleTime: 6 * HOUR_MS
  },
  notices: {
    gcTime: HOUR_MS,
    staleTime: 10 * MINUTE_MS
  },
  ocid: {
    gcTime: 7 * DAY_MS,
    staleTime: DAY_MS
  }
} as const
