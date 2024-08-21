import { create } from 'zustand';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';
import dayjs from 'dayjs';

export interface Bolo {
  plate: string;
  reason: string;
  expiresAt: string;
}

const DEBUG_BOLOS: Bolo[] = [
  { plate: 'AF30442', reason: 'This vehicle is wanted because its been a part of a murder and we need to confiscate it to check for evidence', expiresAt: dayjs(new Date()).format('DD-MM-YYYY') },
  { plate: 'AF30442', reason: 'Billy', expiresAt: dayjs(new Date()).format('DD-MM-YYYY') },
];

type BoloStore = {
  bolos: Bolo[];
  setBolos: (bolos: Bolo[]) => void;
  getBolos: () => Promise<{ bolos: Bolo[] }>;
};

const useBoloStore = create<BoloStore>((set) => ({
  bolos: isEnvBrowser() ? DEBUG_BOLOS : [],
  getBolos: async () => {
    try {
      const resp = await fetchNui<Bolo[]>('getBolos');
      set({ bolos: resp });
      return { bolos: resp };
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      return { bolos: [] }; 
    }
  },
  setBolos: (bolos) => set({ bolos }),
}));

export default useBoloStore;