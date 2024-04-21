import { getChar } from '@/api/character'
import { getDate } from '@/utils/getDate'
import { useEffect, useState } from 'react'
import CashInfo from '../cashInfo'

type BasicType = {
  character_class: string
  character_class_level: string
  character_exp: number
  character_exp_rate: string
  character_gender: string
  character_guild_name: string
  character_image: string
  character_level: number
  character_name: string
  date: string
  world_name: string
}

type Props = {
  nickName: string | undefined
  ocid: string | undefined
}
export default function BasicInfo({ nickName, ocid }: Props) {
  const [basicData, setBasicData] = useState<BasicType>({
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
  })

  const fetchData = async (
    ocid: string | undefined,
    nickName: string | undefined
  ) => {
    if (!ocid) {
      return
    }
    if (!nickName) {
      return
    }
    const basicInfoResponse = await getChar(ocid, getDate())
    setBasicData(basicInfoResponse as BasicType)
  }

  // 경험치 퍼센티지 숫자
  const number = '10%'

  useEffect(() => {
    fetchData(ocid, nickName)
  }, [nickName])

  return (
    <section className="bg-slate-100 shadow-md rounded outline outline-slate-200	p-5">
      <header className="sr-only">캐릭터 기본 정보</header>
      <div className="flex items-center flex-wrap">
        <div>
          <CashInfo
            nickName={nickName}
            ocid={ocid}
          />
          <img
            className="rounded-xl w-[120px] p-2"
            src={basicData.character_image}
            alt={basicData.character_name}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="w-fit rounded-xl border p-1">
            {basicData.world_name}
          </span>
          <span className="text-xl font-extrabold">
            {basicData.character_name}
          </span>
          <div className="flex divide-x-[1px] gap-1">
            <span className="pr-1">{basicData.character_level}</span>
            <span className="pl-2 pr-1">{basicData.character_class}</span>
            <span className="pl-2 pr-1">인기도 1000</span>
            <span className="pl-2">{basicData.character_guild_name}</span>
          </div>
          <div className="w-full  bg-gray-100 rounded-3xl h-2.5 ">
            <div
              className="bg-yellow-300 h-2.5 rounded-3xl"
              style={{ width: number }}></div>
          </div>
        </div>
      </div>
    </section>
  )
}
