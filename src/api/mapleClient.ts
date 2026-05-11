import ky from 'ky'

const mapleClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL
})

export default mapleClient
