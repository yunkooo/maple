import ky from 'ky'

const instance = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL
})

export default instance
