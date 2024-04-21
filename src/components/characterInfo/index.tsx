import { useEffect, useState } from 'react'
import BasicInfo from '../basicInfo'
import { getOcid } from '@/api/character'
import { useParams } from 'react-router-dom'

type OcidType = {
  ocid: string | undefined
}

export default function CharacterInfo() {
  const { nickname } = useParams()

  const [ocidData, setOcidData] = useState<OcidType>({ ocid: '' })

  const fetchOcidData = async (nickName: string | undefined) => {
    if (nickName) {
      const ocidResponse = await getOcid(nickName)
      setOcidData(ocidResponse)
    }
  }
  useEffect(() => {
    fetchOcidData(nickname)
  }, [nickname])

  return (
    <div>
      <BasicInfo
        nickName={nickname}
        ocid={ocidData.ocid}></BasicInfo>
    </div>
  )
}
