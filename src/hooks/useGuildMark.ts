import { getGuildRanking } from '@/api/character'
import type { GuildRankingItem } from '@/api/character.types'
import { queryCacheTime } from '@/lib/queryCache'
import { useQuery } from '@tanstack/react-query'

type UseGuildMarkParams = {
  date?: string
  guildName?: string
  worldName?: string
}

const getNormalizedDate = (date?: string) => {
  if (!date || date === '-') {
    return ''
  }

  return date.split('T')[0]
}

const findGuildMark = (
  ranking: GuildRankingItem[],
  guildName: string,
  worldName: string
) => {
  const matchedGuild = ranking.find(
    guild =>
      guild.guild_name === guildName &&
      (!guild.world_name || guild.world_name === worldName)
  )

  return matchedGuild?.guild_mark ?? ''
}

export function useGuildMark({
  date,
  guildName,
  worldName
}: UseGuildMarkParams) {
  const normalizedDate = getNormalizedDate(date)
  const normalizedGuildName = guildName?.trim()
  const normalizedWorldName = worldName?.trim()
  const query = useQuery({
    enabled: Boolean(
      normalizedDate && normalizedGuildName && normalizedWorldName
    ),
    gcTime: queryCacheTime.guildMark.gcTime,
    queryFn: async () => {
      const response = await getGuildRanking({
        date: normalizedDate,
        guild_name: normalizedGuildName,
        ranking_type: 0,
        world_name: normalizedWorldName
      })

      return findGuildMark(
        response.ranking ?? [],
        normalizedGuildName || '',
        normalizedWorldName || ''
      )
    },
    queryKey: [
      'guild',
      'mark',
      normalizedDate,
      normalizedGuildName,
      normalizedWorldName
    ],
    staleTime: queryCacheTime.guildMark.staleTime
  })

  return query.data ?? ''
}
