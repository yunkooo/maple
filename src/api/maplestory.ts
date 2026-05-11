import mapleClient from './mapleClient'
import type {
  AchievementRankingDto,
  AchievementRankingQuery,
  BattlePracticeReplayDto,
  BattlePracticeResultDto,
  BattlePracticeTimelineDto,
  CharacterName,
  CharacterSummaryDto,
  CharacterUnionDto,
  DojangRankingDto,
  DojangRankingQuery,
  GuildDto,
  GuildRankingDto,
  GuildRankingQuery,
  NoticeDetailDto,
  NoticeListItemDto,
  NoticeType,
  OverallRankingDto,
  OverallRankingQuery,
  ProbabilityHistoryDto,
  ProbabilityHistoryQuery,
  ProbabilityHistoryType,
  TheSeedRankingDto,
  TheSeedRankingQuery,
  UnionRankingDto,
  UnionRankingQuery
} from './maplestory.types'

type SearchParamValue = string | number | boolean

type SearchParams = Record<string, SearchParamValue | undefined>

const toSearchParams = (params: SearchParams) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ) as Record<string, SearchParamValue>

const getCharacterSummary = async (characterName: CharacterName) => {
  const response = await mapleClient.get(
    `maplestory/characters/${characterName}/summary`
  )

  return response.json<CharacterSummaryDto>()
}

const getCharacterUnion = async (characterName: CharacterName) => {
  const response = await mapleClient.get(
    `maplestory/characters/${characterName}/union`
  )

  return response.json<CharacterUnionDto>()
}

const getGuild = async (worldName: string, guildName: string) => {
  const response = await mapleClient.get(
    `maplestory/guilds/${worldName}/${guildName}`
  )

  return response.json<GuildDto>()
}

const getOverallRanking = async (query: OverallRankingQuery) => {
  const response = await mapleClient.get('maplestory/rankings/overall', {
    searchParams: toSearchParams(query)
  })

  return response.json<OverallRankingDto[]>()
}

const getUnionRanking = async (query: UnionRankingQuery) => {
  const response = await mapleClient.get('maplestory/rankings/union', {
    searchParams: toSearchParams(query)
  })

  return response.json<UnionRankingDto[]>()
}

const getGuildRanking = async (query: GuildRankingQuery) => {
  const response = await mapleClient.get('maplestory/rankings/guild', {
    searchParams: toSearchParams(query)
  })

  return response.json<GuildRankingDto[]>()
}

const getDojangRanking = async (query: DojangRankingQuery) => {
  const response = await mapleClient.get('maplestory/rankings/dojang', {
    searchParams: toSearchParams(query)
  })

  return response.json<DojangRankingDto[]>()
}

const getTheSeedRanking = async (query: TheSeedRankingQuery) => {
  const response = await mapleClient.get('maplestory/rankings/theseed', {
    searchParams: toSearchParams(query)
  })

  return response.json<TheSeedRankingDto[]>()
}

const getAchievementRanking = async (query: AchievementRankingQuery) => {
  const response = await mapleClient.get('maplestory/rankings/achievement', {
    searchParams: toSearchParams(query)
  })

  return response.json<AchievementRankingDto[]>()
}

const getNotices = async () => {
  const response = await mapleClient.get('maplestory/notices')

  return response.json<NoticeListItemDto[]>()
}

const getNoticeDetail = async (type: NoticeType, noticeId: number) => {
  const response = await mapleClient.get(
    `maplestory/notices/${type}/${noticeId}`
  )

  return response.json<NoticeDetailDto>()
}

const getBattlePracticeReplays = async (characterName: CharacterName) => {
  const response = await mapleClient.get(
    `maplestory/characters/${characterName}/battle-practice/replays`
  )

  return response.json<BattlePracticeReplayDto[]>()
}

const getBattlePracticeResult = async (replayId: string) => {
  const response = await mapleClient.get(
    `maplestory/battle-practice/${replayId}/result`
  )

  return response.json<BattlePracticeResultDto>()
}

const getBattlePracticeTimeline = async (replayId: string, pageNo?: number) => {
  const response = await mapleClient.get(
    `maplestory/battle-practice/${replayId}/timeline`,
    {
      searchParams: toSearchParams({ page_no: pageNo })
    }
  )

  return response.json<BattlePracticeTimelineDto>()
}

const getProbabilityHistory = async (
  type: ProbabilityHistoryType,
  query: ProbabilityHistoryQuery
) => {
  const response = await mapleClient.get(`maplestory/probability/${type}`, {
    searchParams: toSearchParams(query)
  })

  return response.json<ProbabilityHistoryDto>()
}

export {
  getAchievementRanking,
  getBattlePracticeReplays,
  getBattlePracticeResult,
  getBattlePracticeTimeline,
  getCharacterSummary,
  getCharacterUnion,
  getDojangRanking,
  getGuild,
  getGuildRanking,
  getNoticeDetail,
  getNotices,
  getOverallRanking,
  getProbabilityHistory,
  getTheSeedRanking,
  getUnionRanking
}
