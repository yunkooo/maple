import { getBeauty, getCashItem } from '@/api/character'
import { getDate } from '@/utils/getDate'
import { useEffect, useState } from 'react'

type PresetNumber = 1 | 2 | 3
type CashType = {
  additional_cash_item_equipment_base: []
  additional_cash_item_equipment_preset_1: []
  additional_cash_item_equipment_preset_2: []
  additional_cash_item_equipment_preset_3: []
  cash_item_equipment_base: []
  cash_item_equipment_preset_1: []
  cash_item_equipment_preset_2: []
  cash_item_equipment_preset_3: []
  character_class: string
  character_gender: string
  date: string
  preset_no: PresetNumber
} | null
type CashItemListType = {
  cash_item_equipment_part: string
  cash_item_equipment_slot: string
  cash_item_name: string
  cash_item_icon: string
  cash_item_description: string
  cash_item_option: [
    {
      option_type: string
      option_value: string
    }
  ]
  date_expire: string
  date_option_expire: string
  cash_item_label: string
  cash_item_coloring_prism: {
    color_range: string
    hue: number
    saturation: number
    value: number
  }
  item_gender: string
}

type BeautyType = {
  date: string
  character_gender: string
  character_class: string
  character_hair: {
    base_color: string
    hair_name: string
    mix_color: string
    mix_rate: string
  }
  character_face: {
    base_color: string
    face_name: string
    mix_color: string
    mix_rate: string
  }
  character_skin_name: string
  additional_character_hair: null
  additional_character_face: null
  additional_character_skin_name: null
} | null

type Props = {
  nickName: string | undefined
  ocid: string | undefined
}

export default function CashInfo({ nickName, ocid }: Props) {
  const [cashData, setCashData] = useState<CashType>(null)
  const [beautyData, setBeautyData] = useState<BeautyType>(null)

  const fetchCashData = async (
    ocid: string | undefined,
    nickName: string | undefined
  ) => {
    if (!ocid) {
      return
    }
    if (!nickName) {
      return
    }
    const cashResponse = await getCashItem(ocid, getDate())
    const beautyResponse = await getBeauty(ocid, getDate())

    setCashData(cashResponse as CashType)
    setBeautyData(beautyResponse as BeautyType)
  }

  useEffect(() => {
    fetchCashData(nickName, ocid)
  }, [nickName])

  function getNowCashData(cashData: CashType) {
    if (cashData !== null) {
      const nowCashData =
        cashData[`cash_item_equipment_preset_${cashData.preset_no}`]
      return nowCashData
    }
  }

  const nowCashData = getNowCashData(cashData)

  function getItem(cash: [] | undefined, slot: string) {
    if (cash === undefined) {
      return
    }
    const [slotItem]: Array<CashItemListType> = cash.filter(
      (item: { cash_item_equipment_slot: string; cash_item_name: string }) =>
        item.cash_item_equipment_slot === slot
    )
    return slotItem?.cash_item_name
  }
  return (
    <div className="p-2 text-center bg-white rounded">
      <span className="">코디 분석</span>
      <div className="border-t-2 flex gap-2">
        <span className="text-slate-400 text-sm	">모자</span>
        <span className="text-sm">{getItem(nowCashData, '모자') || '-'}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-slate-400 text-sm	">헤어</span>
        <span className="text-sm">{beautyData?.character_hair.hair_name}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-slate-400 text-sm	">성형</span>
        <span className="text-sm">{beautyData?.character_face.face_name}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-slate-400 text-sm	">상의</span>
        <span className="text-sm">{getItem(nowCashData, '상의') || '-'}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-slate-400 text-sm	">하의</span>
        <span className="text-sm">{getItem(nowCashData, '하의') || '-'}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-slate-400 text-sm	">신발</span>
        <span className="text-sm"> {getItem(nowCashData, '신발') || '-'}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-slate-400 text-sm	">무기</span>
        <span className="text-sm"> {getItem(nowCashData, '무기') || '-'}</span>
      </div>
    </div>
  )
}
