import { create } from 'zustand';
import { isEnvBrowser } from '../utils/misc';

// Define the state shape and associated actions
type AppVisibilityState = {
  showApp: boolean;
  setVisibility: (boolean: boolean) => void;
  show: () => void;
  hide: () => void;
  toggle: () => void;
};

const useAppVisibilityStore = create<AppVisibilityState>((set) => ({
  showApp: isEnvBrowser() ? true : false,

  setVisibility: (boolean: boolean) => set({ showApp: boolean }),
  show: () => set({ showApp: true }),
  hide: () => set({ showApp: false }),
  toggle: () => set((state) => ({ showApp: !state.showApp })),
}));

export default useAppVisibilityStore;