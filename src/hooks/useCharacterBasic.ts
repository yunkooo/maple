import { getChar } from '@/api/character'
import { CharacterBasic, RequestStatus } from '@/api/character.types'
import { getMapleApiDate } from '@/lib/mapleDate'
import { queryCacheTime } from '@/lib/queryCache'
import { useQuery } from '@tanstack/react-query'

export const initialCharacterBasic: CharacterBasic = {
  character_class: '',
  character_class_level: '',
  character_exp: 0,
  character_exp_rate: '',
  character_gender: '',
  character_guild_name: '',
  character_image: '',
  character_level: 0,
  character_name: '',
  date: '',
  world_name: ''
}

export function useCharacterBasic(ocid: string | undefined) {
  const date = getMapleApiDate()
  const query = useQuery({
    enabled: Boolean(ocid),
    gcTime: queryCacheTime.characterDailyData.gcTime,
    queryFn: () => getChar(ocid || '', date),
    queryKey: ['character', 'basic', ocid, date],
    staleTime: queryCacheTime.characterDailyData.staleTime
  })
  const status: RequestStatus = !ocid
    ? 'idle'
    : query.isLoading
      ? 'loading'
      : query.isError
        ? 'error'
        : 'idle'

  return { basicData: query.data ?? initialCharacterBasic, status }
}
