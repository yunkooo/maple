import type {
  BeautyEquipmentResponse,
  CashEquipmentResponse,
  CharacterBasic,
  Equipment
} from './character.types'

export type ApiErrorResponse = {
  message: string
  code?: string
}

export type MapleDate = string

export type CharacterName = string

export type CharacterOcid = string

export type GuildId = string

export type NoticeType = 'notice' | 'update' | 'event' | 'cashshop'

export type CharacterSummaryDto = {
  ocid: CharacterOcid
  basic: CharacterBasic
  equipment: Equipment[]
  cash: CashEquipmentResponse | null
  beauty: BeautyEquipmentResponse | null
}

export type UnionInfoDto = {
  date?: MapleDate
  union_level?: number
  union_grade?: string
  union_artifact_level?: number
  union_artifact_exp?: number
  union_artifact_point?: number
}

export type UnionRaiderDto = {
  date?: MapleDate
  union_raider_stat?: string[]
  union_occupied_stat?: string[]
  union_inner_stat?: Array<Record<string, unknown>>
  union_block?: Array<Record<string, unknown>>
}

export type UnionArtifactDto = {
  date?: MapleDate
  union_artifact_effect?: Array<Record<string, unknown>>
  union_artifact_crystal?: Array<Record<string, unknown>>
}

export type UnionChampionDto = {
  date?: MapleDate
  union_champion?: Array<Record<string, unknown>>
}

export type CharacterUnionDto = {
  ocid: CharacterOcid
  union: UnionInfoDto
  raider: UnionRaiderDto
  artifact: UnionArtifactDto
  champion: UnionChampionDto | null
}

export type GuildBasicDto = {
  date?: MapleDate
  world_name?: string
  guild_name?: string
  guild_level?: number
  guild_fame?: number
  guild_point?: number
  guild_master_name?: string
  guild_member_count?: number
  guild_member?: string[]
  guild_skill?: Array<Record<string, unknown>>
  guild_noblesse_skill?: Array<Record<string, unknown>>
}

export type GuildDto = {
  oguild_id: GuildId
  basic: GuildBasicDto
}

export type NoticeListItemDto = {
  notice_id: number
  title: string
  url: string
  date: MapleDate
  type: NoticeType
}

export type NoticeDetailDto = NoticeListItemDto & {
  contents: string
}

export type RankingItemBaseDto = {
  date?: MapleDate
  ranking: number
  character_name?: string
  world_name?: string
  class_name?: string
  sub_class_name?: string
}

export type OverallRankingDto = RankingItemBaseDto & {
  character_level?: number
  character_exp?: number
}

export type UnionRankingDto = RankingItemBaseDto & {
  union_level?: number
}

export type GuildRankingDto = {
  date?: MapleDate
  ranking: number
  guild_name: string
  world_name: string
  guild_level?: number
  guild_master_name?: string
  guild_mark?: string
  guild_point?: number
}

export type DojangRankingDto = RankingItemBaseDto & {
  dojang_floor?: number
  dojang_time_record?: number
}

export type TheSeedRankingDto = RankingItemBaseDto & {
  theseed_floor?: number
  theseed_time_record?: number
}

export type AchievementRankingDto = RankingItemBaseDto & {
  trophy_grade?: string
  trophy_score?: number
}

export type BattlePracticeReplayDto = {
  replay_id: string
  date?: MapleDate
  character_name?: string
  world_name?: string
}

export type BattlePracticeResultDto = {
  replay_id: string
  data: Record<string, unknown>
}

export type BattlePracticeTimelineDto = {
  replay_id: string
  page_no?: number
  next_page_no?: number | null
  skills: Array<Record<string, unknown>>
}

export type ProbabilityHistoryType = 'starforce' | 'potential' | 'cube'

export type ProbabilityHistoryQuery = {
  count: number
  date?: MapleDate
  cursor?: string
}

export type ProbabilityHistoryDto = {
  type: ProbabilityHistoryType
  count: number
  next_cursor?: string | null
  history: Array<Record<string, unknown>>
}

export type RankingQuery = {
  date: MapleDate
  world_name?: string
  page?: number
}

export type OverallRankingQuery = RankingQuery & {
  world_type?: number
  class?: string
  ocid?: CharacterOcid
}

export type UnionRankingQuery = RankingQuery & {
  ocid?: CharacterOcid
}

export type GuildRankingQuery = RankingQuery & {
  ranking_type: number
  guild_name?: string
}

export type DojangRankingQuery = RankingQuery & {
  difficulty: number
  class?: string
  ocid?: CharacterOcid
}

export type TheSeedRankingQuery = RankingQuery & {
  ocid?: CharacterOcid
}

export type AchievementRankingQuery = {
  date: MapleDate
  ocid?: CharacterOcid
  page?: number
}
