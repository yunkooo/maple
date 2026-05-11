import { getOcid } from '@/api/character'
import { RequestStatus } from '@/api/character.types'
import { useEffect, useState } from 'react'

export function useCharacterOcid(nickname: string | undefined) {
  const [ocid, setOcid] = useState<string | undefined>()
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let ignore = false

    const fetchOcidData = async () => {
      setOcid(undefined)
      setErrorMessage('')

      if (!nickname) {
        setStatus('idle')
        return
      }

      setStatus('loading')

      try {
        const response = await getOcid(nickname)

        if (!ignore) {
          setOcid(response.ocid)
          setStatus('idle')
        }
      } catch {
        if (!ignore) {
          setStatus('error')
          setErrorMessage('캐릭터를 찾지 못했습니다. 닉네임을 확인해주세요.')
        }
      }
    }

    fetchOcidData()

    return () => {
      ignore = true
    }
  }, [nickname])

  return { errorMessage, ocid, status }
}
