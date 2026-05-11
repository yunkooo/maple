import {
  getAbility,
  getCharacterStat,
  getHexaMatrix,
  getLinkSkill,
  getSetEffect,
  getSymbolEquipment,
  getUnion
} from '@/api/character'
import {
  AbilityResponse,
  CharacterStatResponse,
  HexaMatrixResponse,
  LinkSkillResponse,
  RequestStatus,
  SetEffectResponse,
  SymbolEquipmentResponse,
  UnionResponse
} from '@/api/character.types'
import { getMapleApiDate } from '@/lib/mapleDate'
import { queryCacheTime } from '@/lib/queryCache'
import { useQuery } from '@tanstack/react-query'

type CharacterAnalysisData = {
  ability: AbilityResponse | null
  stat: CharacterStatResponse | null
  hexa: HexaMatrixResponse | null
  linkSkill: LinkSkillResponse | null
  setEffect: SetEffectResponse | null
  symbol: SymbolEquipmentResponse | null
  union: UnionResponse | null
}

const initialAnalysisData: CharacterAnalysisData = {
  ability: null,
  stat: null,
  hexa: null,
  linkSkill: null,
  setEffect: null,
  symbol: null,
  union: null
}

const getSettledValue = <T>(result: PromiseSettledResult<T>) =>
  result.status === 'fulfilled' ? result.value : null

const getCharacterAnalysis = async (
  ocid: string,
  date: string
): Promise<CharacterAnalysisData> => {
  const [stat, setEffect, ability, symbol, linkSkill, union, hexa] =
    await Promise.allSettled([
      getCharacterStat(ocid, date),
      getSetEffect(ocid, date),
      getAbility(ocid, date),
      getSymbolEquipment(ocid, date),
      getLinkSkill(ocid, date),
      getUnion(ocid, date),
      getHexaMatrix(ocid, date)
    ])

  return {
    ability: getSettledValue(ability),
    stat: getSettledValue(stat),
    hexa: getSettledValue(hexa),
    linkSkill: getSettledValue(linkSkill),
    setEffect: getSettledValue(setEffect),
    symbol: getSettledValue(symbol),
    union: getSettledValue(union)
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
