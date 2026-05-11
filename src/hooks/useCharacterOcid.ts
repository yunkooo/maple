import { getOcid } from '@/api/character'
import { RequestStatus } from '@/api/character.types'
import { HTTPError } from 'ky'
import { useEffect, useState } from 'react'

type MapleApiErrorBody = {
  error?: {
    message?: string
    name?: string
  }
}

async function getCharacterLookupErrorMessage(error: unknown) {
  if (!(error instanceof HTTPError)) {
    return '캐릭터를 찾지 못했습니다. 닉네임을 확인해주세요.'
  }

  const responseBody = await error.response
    .json()
    .then(body => body as MapleApiErrorBody)
    .catch(() => undefined)

  if (responseBody?.error?.name === 'LOCAL_CONFIG_MISSING_NEXON_API_KEY') {
    return 'NEXON_API_KEY가 설정되지 않았습니다. .env에 Nexon Open API 키를 입력한 뒤 개발 서버를 다시 실행해주세요.'
  }

  if (responseBody?.error?.name) {
    return `캐릭터 조회에 실패했습니다. (${responseBody.error.name})`
  }

  return '캐릭터를 찾지 못했습니다. 닉네임을 확인해주세요.'
}

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
      } catch (error) {
        if (!ignore) {
          setStatus('error')
          setErrorMessage(await getCharacterLookupErrorMessage(error))
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
