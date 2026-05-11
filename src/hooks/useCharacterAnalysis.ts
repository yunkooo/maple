import {
  getAbility,
  getCharacterSkill,
  getCharacterStat,
  getHexaMatrix,
  getHexaMatrixStat,
  getLinkSkill,
  getSetEffect,
  getSymbolEquipment,
  getUnion,
  getUnionArtifact,
  getUnionChampion,
  getUnionRaider
} from '@/api/character'
import {
  AbilityResponse,
  CharacterSkillResponse,
  CharacterStatResponse,
  HexaMatrixResponse,
  HexaMatrixStatResponse,
  LinkSkillResponse,
  RequestStatus,
  SetEffectResponse,
  SymbolEquipmentResponse,
  UnionArtifactResponse,
  UnionChampionResponse,
  UnionRaiderResponse,
  UnionResponse
} from '@/api/character.types'
import { getMapleApiDate } from '@/lib/mapleDate'
import { queryCacheTime } from '@/lib/queryCache'
import { useQuery } from '@tanstack/react-query'

type CharacterAnalysisData = {
  ability: AbilityResponse | null
  stat: CharacterStatResponse | null
  hexa: HexaMatrixResponse | null
  hexaStat: HexaMatrixStatResponse | null
  linkSkill: LinkSkillResponse | null
  setEffect: SetEffectResponse | null
  sixthSkill: CharacterSkillResponse | null
  symbol: SymbolEquipmentResponse | null
  union: UnionResponse | null
  unionArtifact: UnionArtifactResponse | null
  unionChampion: UnionChampionResponse | null
  unionRaider: UnionRaiderResponse | null
}

const initialAnalysisData: CharacterAnalysisData = {
  ability: null,
  stat: null,
  hexa: null,
  hexaStat: null,
  linkSkill: null,
  setEffect: null,
  sixthSkill: null,
  symbol: null,
  union: null,
  unionArtifact: null,
  unionChampion: null,
  unionRaider: null
}

const getSettledValue = <T>(result: PromiseSettledResult<T>) =>
  result.status === 'fulfilled' ? result.value : null

const getCharacterAnalysis = async (
  ocid: string,
  date: string
): Promise<CharacterAnalysisData> => {
  const [
    stat,
    setEffect,
    ability,
    symbol,
    linkSkill,
    union,
    unionRaider,
    unionArtifact,
    unionChampion,
    hexa,
    hexaStat,
    sixthSkill
  ] = await Promise.allSettled([
    getCharacterStat(ocid, date),
    getSetEffect(ocid, date),
    getAbility(ocid, date),
    getSymbolEquipment(ocid, date),
    getLinkSkill(ocid, date),
    getUnion(ocid, date),
    getUnionRaider(ocid, date),
    getUnionArtifact(ocid, date),
    getUnionChampion(ocid, date),
    getHexaMatrix(ocid, date),
    getHexaMatrixStat(ocid, date),
    getCharacterSkill(ocid, date, '6')
  ])

  return {
    ability: getSettledValue(ability),
    stat: getSettledValue(stat),
    hexa: getSettledValue(hexa),
    hexaStat: getSettledValue(hexaStat),
    linkSkill: getSettledValue(linkSkill),
    setEffect: getSettledValue(setEffect),
    sixthSkill: getSettledValue(sixthSkill),
    symbol: getSettledValue(symbol),
    union: getSettledValue(union),
    unionArtifact: getSettledValue(unionArtifact),
    unionChampion: getSettledValue(unionChampion),
    unionRaider: getSettledValue(unionRaider)
  }
}

export function useCharacterAnalysis(ocid: string | undefined) {
  const date = getMapleApiDate()
  const query = useQuery({
    enabled: Boolean(ocid),
    gcTime: queryCacheTime.characterDailyData.gcTime,
    queryFn: () => getCharacterAnalysis(ocid || '', date),
    queryKey: ['character', 'analysis', ocid, date],
    staleTime: queryCacheTime.characterDailyData.staleTime
  })
  const status: RequestStatus = !ocid
    ? 'idle'
    : query.isLoading
      ? 'loading'
      : query.isError && !query.data
        ? 'error'
        : 'idle'

  return { analysisData: query.data ?? initialAnalysisData, status }
}
