import { create } from 'zustand'

const useUIStore = create((set) => ({
  isUpgradeModalOpen: false,
  isHelpModalOpen: false,

  openUpgradeModal: () => set({ isUpgradeModalOpen: true }),
  closeUpgradeModal: () => set({ isUpgradeModalOpen: false }),

  openHelpModal: () => set({ isHelpModalOpen: true }),
  closeHelpModal: () => set({ isHelpModalOpen: false }),
}))

export default useUIStore
