import { getChar } from '@/api/character'
import { CharacterBasic, RequestStatus } from '@/api/character.types'
import { getDate } from '@/lib/date'
import { useEffect, useState } from 'react'

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
  const [basicData, setBasicData] = useState<CharacterBasic>(
    initialCharacterBasic
  )
  const [status, setStatus] = useState<RequestStatus>('idle')

  useEffect(() => {
    let ignore = false

    const fetchData = async () => {
      setBasicData(initialCharacterBasic)

      if (!ocid) {
        setStatus('idle')
        return
      }

      setStatus('loading')

      try {
        const basicInfoResponse = await getChar(ocid, getDate())

        if (!ignore) {
          setBasicData(basicInfoResponse)
          setStatus('idle')
        }
      } catch {
        if (!ignore) {
          setStatus('error')
        }
      }
    }

    fetchData()

    return () => {
      ignore = true
    }
  }, [ocid])

  return { basicData, status }
}
