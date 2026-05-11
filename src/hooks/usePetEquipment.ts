import { getPetEquipment } from '@/api/character'
import { PetEquipmentResponse, RequestStatus } from '@/api/character.types'
import { getMapleApiDate } from '@/lib/mapleDate'
import { queryCacheTime } from '@/lib/queryCache'
import { useQuery } from '@tanstack/react-query'

export function usePetEquipment(ocid: string | undefined) {
  const date = getMapleApiDate()
  const query = useQuery<PetEquipmentResponse>({
    enabled: Boolean(ocid),
    gcTime: queryCacheTime.characterDailyData.gcTime,
    queryFn: async () => getPetEquipment(ocid || '', date),
    queryKey: ['character', 'pet-equipment', ocid, date],
    staleTime: queryCacheTime.characterDailyData.staleTime
  })
  const status: RequestStatus = !ocid
    ? 'idle'
    : query.isLoading
      ? 'loading'
      : query.isError
        ? 'error'
        : 'idle'

  return {
    petData: query.data ?? null,
    status
  }
}
