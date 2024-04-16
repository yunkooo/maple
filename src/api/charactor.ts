import instance from './instance'

const getOcid = async (name: string) => {
  const response = await instance.get(`id?character_name=${name}`)
  return response.json()
}

const getChar = async (ocid: string, nowDate: string) => {
  const response = await instance.get(
    `character/basic?ocid=${ocid}&date=${nowDate}`
  )
  return response.json()
}

export { getOcid, getChar }
