import { getEquipment } from '@/api/character'
import { Equipment, RequestStatus } from '@/api/character.types'
import { getMapleApiDate } from '@/lib/mapleDate'
import { useEffect, useState } from 'react'

export function useEquipment(ocid: string | undefined) {
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([])
  const [status, setStatus] = useState<RequestStatus>('idle')

  useEffect(() => {
    let ignore = false

    const fetchEqupmentData = async () => {
      setEquipmentData([])

      if (!ocid) {
        setStatus('idle')
        return
      }

      setStatus('loading')

      try {
        const equipmentDataResponse = await getEquipment(
          ocid,
          getMapleApiDate()
        )

        if (!ignore) {
          setEquipmentData(equipmentDataResponse.item_equipment || [])
          setStatus('idle')
        }
      } catch {
        if (!ignore) {
          setStatus('error')
        }
      }
    }

    fetchEqupmentData()

    return () => {
      ignore = true
    }
  }, [ocid])

  return { equipmentData, status }
}
