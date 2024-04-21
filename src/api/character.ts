import instance from './instance'

const getOcid = async (name: string) => {
  const response = await instance.get(`id?character_name=${name}`)
  return response.json<{ ocid: string | undefined }>()
}

const getChar = async (ocid: string, nowDate: string) => {
  const response = await instance.get(
    `character/basic?ocid=${ocid}&date=${nowDate}`
  )
  return response.json()
}

const getCashItem = async (ocid: string, nowDate: string) => {
  const response = await instance.get(
    `character/cashitem-equipment?ocid=${ocid}&date=${nowDate}`
  )
  return response.json<{
    preset_no: number | undefined
    cash_item_equipment_base: []
    cash_item_equipment_preset_1: []
    cash_item_equipment_preset_2: []
    cash_item_equipment_preset_3: []
  }>()
}

const getBeauty = async (ocid: string, nowDate: string) => {
  const response = await instance.get(
    `character/beauty-equipment?ocid=${ocid}&date=${nowDate}`
  )
  return response.json()
}

export { getOcid, getChar, getCashItem, getBeauty }
