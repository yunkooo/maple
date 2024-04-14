import instance from './instance'

const getOcid = async (name: string) => {
  const res = await instance.get(`id?character_name=${name}`)
  console.log(res)
}

export default getOcid
