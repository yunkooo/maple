import mapleClient from './mapleClient'
import {
  AbilityResponse,
  BeautyEquipmentResponse,
  CashEquipmentResponse,
  CharacterBasic,
  CharacterOcidResponse,
  CharacterSkillGrade,
  CharacterSkillResponse,
  CharacterStatResponse,
  EquipmentResponse,
  HexaMatrixResponse,
  HexaMatrixStatResponse,
  GuildRankingQuery,
  GuildRankingResponse,
  LinkSkillResponse,
  PetEquipmentResponse,
  SetEffectResponse,
  SymbolEquipmentResponse,
  UnionArtifactResponse,
  UnionChampionResponse,
  UnionRaiderResponse,
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

const getPetEquipment = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/pet-equipment', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<PetEquipmentResponse>()
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

const getCharacterSkill = async (
  ocid: string,
  nowDate: string,
  skillGrade: CharacterSkillGrade
) => {
  const response = await mapleClient.get('character/skill', {
    searchParams: {
      ocid,
      date: nowDate,
      character_skill_grade: skillGrade
    }
  })

  return response.json<CharacterSkillResponse>()
}

const getUnion = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('user/union', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<UnionResponse>()
}

const getUnionRaider = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('user/union-raider', {
    searchParams: { ocid, date: nowDate }
  })

  return response.json<UnionRaiderResponse>()
}

const getUnionArtifact = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('user/union-artifact', {
    searchParams: { ocid, date: nowDate }
  })

  return response.json<UnionArtifactResponse>()
}

const getUnionChampion = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('user/union-champion', {
    searchParams: { ocid, date: nowDate }
  })

  return response.json<UnionChampionResponse>()
}

const getHexaMatrix = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/hexamatrix', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<HexaMatrixResponse>()
}

const getHexaMatrixStat = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/hexamatrix-stat', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<HexaMatrixStatResponse>()
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
  getHexaMatrixStat,
  getCharacterSkill,
  getLinkSkill,
  getPetEquipment,
  getSetEffect,
  getSymbolEquipment,
  getUnion,
  getUnionArtifact,
  getUnionChampion,
  getUnionRaider
}
