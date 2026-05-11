import { getBeauty, getCashItem } from '@/api/character'
import {
  BeautyEquipmentResponse,
  CashEquipmentResponse,
  RequestStatus
} from '@/api/character.types'
import { getMapleApiDate } from '@/lib/mapleDate'
import { queryCacheTime } from '@/lib/queryCache'
import { useQuery } from '@tanstack/react-query'

export function useCashEquipment(ocid: string | undefined) {
  const date = getMapleApiDate()
  const query = useQuery<{
    beautyData: BeautyEquipmentResponse
    cashData: CashEquipmentResponse
  }>({
    enabled: Boolean(ocid),
    gcTime: queryCacheTime.characterDailyData.gcTime,
    queryFn: async () => {
      const [cashData, beautyData] = await Promise.all([
        getCashItem(ocid || '', date),
        getBeauty(ocid || '', date)
      ])

      return { beautyData, cashData }
    },
    queryKey: ['character', 'cash-equipment', ocid, date],
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
    beautyData: query.data?.beautyData ?? null,
    cashData: query.data?.cashData ?? null,
    status
  }
}
