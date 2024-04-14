import ky from 'ky'

const instance = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  headers: {
    'x-nxopen-api-key': import.meta.env.VITE_API_KEY
  }
})

export default instance
