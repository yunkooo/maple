import { getBeauty, getCashItem } from '@/api/character'
import {
  BeautyEquipmentResponse,
  CashEquipmentResponse,
  RequestStatus
} from '@/api/character.types'
import { getMapleApiDate } from '@/lib/mapleDate'
import { useEffect, useState } from 'react'

export function useCashEquipment(ocid: string | undefined) {
  const [cashData, setCashData] = useState<CashEquipmentResponse | null>(null)
  const [beautyData, setBeautyData] = useState<BeautyEquipmentResponse | null>(
    null
  )
  const [status, setStatus] = useState<RequestStatus>('idle')

  useEffect(() => {
    let ignore = false

    const fetchCashData = async () => {
      setCashData(null)
      setBeautyData(null)

      if (!ocid) {
        setStatus('idle')
        return
      }

      setStatus('loading')

      try {
        const [cashResponse, beautyResponse] = await Promise.all([
          getCashItem(ocid, getMapleApiDate()),
          getBeauty(ocid, getMapleApiDate())
        ])

        if (!ignore) {
          setCashData(cashResponse)
          setBeautyData(beautyResponse)
          setStatus('idle')
        }
      } catch {
        if (!ignore) {
          setStatus('error')
        }
      }
    }

    fetchCashData()

    return () => {
      ignore = true
    }
  }, [ocid])

  return { beautyData, cashData, status }
}
