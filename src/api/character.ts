import mapleClient from './mapleClient'
import {
  BeautyEquipmentResponse,
  CashEquipmentResponse,
  CharacterBasic,
  CharacterOcidResponse,
  EquipmentResponse,
  NoticeResponse
} from './character.types'

const getOcid = async (name: string) => {
  const response = await mapleClient.get('id', {
    searchParams: { character_name: name }
  })
  return response.json<CharacterOcidResponse>()
}

const getChar = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/basic', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<CharacterBasic>()
}

const getCashItem = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/cashitem-equipment', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<CashEquipmentResponse>()
}

const getBeauty = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/beauty-equipment', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<BeautyEquipmentResponse>()
}

const getEquipment = async (ocid: string, nowDate: string) => {
  const response = await mapleClient.get('character/item-equipment', {
    searchParams: { ocid, date: nowDate }
  })
  return response.json<EquipmentResponse>()
}

const getNotice = async () => {
  const response = await mapleClient.get('notice')
  return response.json<NoticeResponse>()
}

export { getOcid, getChar, getCashItem, getBeauty, getEquipment, getNotice }
