import instance from './instance'
import {
  BeautyEquipmentResponse,
  CashEquipmentResponse,
  CharacterBasic,
  CharacterOcidResponse,
  EquipmentResponse
} from './character.types'

const getOcid = async (name: string) => {
  const response = await instance.get('id', {
    searchParams: { character_name: name }
  })
  return response.json<CharacterOcidResponse>()
}

const getChar = async (ocid: string, nowDate: string) => {
  const response = await instance.get('character/basic', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<CharacterBasic>()
}

const getCashItem = async (ocid: string, nowDate: string) => {
  const response = await instance.get('character/cashitem-equipment', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<CashEquipmentResponse>()
}

const getBeauty = async (ocid: string, nowDate: string) => {
  const response = await instance.get('character/beauty-equipment', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<BeautyEquipmentResponse>()
}

const getEquipment = async (ocid: string, nowDate: string) => {
  const response = await instance.get('character/item-equipment', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<EquipmentResponse>()
}

export { getOcid, getChar, getCashItem, getBeauty, getEquipment }
