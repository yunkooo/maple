import mapleClient from './mapleClient'
import {
  AbilityResponse,
  BeautyEquipmentResponse,
  CashEquipmentResponse,
  CharacterBasic,
  CharacterOcidResponse,
  CharacterStatResponse,
  EquipmentResponse,
  HexaMatrixResponse,
  GuildRankingQuery,
  GuildRankingResponse,
  LinkSkillResponse,
  SetEffectResponse,
  SymbolEquipmentResponse,
  UnionResponse
} from './character.types'

const getOcid = async (name: string) => {
  const response = await mapleClient.get('id', {
    searchParams: { character_name: name }
  })
  return response.json<CharacterOcidResponse>()
}

const getChar = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/basic', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<CharacterBasic>()
}

const getCashItem = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/cashitem-equipment', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<CashEquipmentResponse>()
}

const getBeauty = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/beauty-equipment', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<BeautyEquipmentResponse>()
}

const getEquipment = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/item-equipment', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<EquipmentResponse>()
}

const getCharacterStat = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/stat', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<CharacterStatResponse>()
}

const getGuildRanking = async (query: GuildRankingQuery) => {
  const response = await mapleClient.get('ranking/guild', {
    searchParams: query
  })

  return response.json<GuildRankingResponse>()
}

const getSetEffect = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/set-effect', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<SetEffectResponse>()
}

const getAbility = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/ability', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<AbilityResponse>()
}

const getSymbolEquipment = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/symbol-equipment', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<SymbolEquipmentResponse>()
}

const getLinkSkill = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/link-skill', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<LinkSkillResponse>()
}

const getUnion = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('user/union', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<UnionResponse>()
}

const getHexaMatrix = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/hexamatrix', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<HexaMatrixResponse>()
}

export {
  getAbility,
  getCharacterStat,
  getOcid,
  getChar,
  getCashItem,
  getBeauty,
  getEquipment,
  getGuildRanking,
  getHexaMatrix,
  getLinkSkill,
  getSetEffect,
  getSymbolEquipment,
  getUnion
}
