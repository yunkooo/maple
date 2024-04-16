import { create } from 'zustand'

interface OcidStore {
  ocidDate: string
  setOcidData: (ocid: string) => void
}

const useOcidStore = create<OcidStore>(set => ({
  ocidDate: '',
  setOcidData: ocid => set({ ocidDate: ocid })
}))

export default useOcidStore
