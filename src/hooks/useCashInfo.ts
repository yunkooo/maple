import { getBeauty, getCashItem } from '@/api/character'
import {
  BeautyEquipmentResponse,
  CashEquipmentResponse,
  RequestStatus
} from '@/api/character.types'
import { getDate } from '@/lib/date'
import { useEffect, useState } from 'react'

export function useCashInfo(ocid: string | undefined) {
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
          getCashItem(ocid, getDate()),
          getBeauty(ocid, getDate())
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
