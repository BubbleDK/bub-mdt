import { create } from 'zustand';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

export interface Warrant {
  citizenid: string;
  firstname: string;
  lastname: string;
  incidentid: number;
  expiresAt: number;
  image?: string;
}

const DEBUG_WARRANTS: Warrant[] = [
  { citizenid: 'AF30442', firstname: 'Billy', lastname: 'Bob', incidentid: 3, expiresAt: Date.now(), image: 'https://i.imgur.com/dqopYB9b.jpg' },
  { citizenid: 'AF30442', firstname: 'Billy', lastname: 'Bob', incidentid: 3, expiresAt: Date.now(), image: 'https://i.imgur.com/dqopYB9b.jpg' },
  { citizenid: 'AF30442', firstname: 'Billy', lastname: 'Bob', incidentid: 3, expiresAt: Date.now(), image: 'https://i.imgur.com/dqopYB9b.jpg' },
  { citizenid: 'AF30442', firstname: 'Billy', lastname: 'Bob', incidentid: 3, expiresAt: Date.now(), image: 'https://i.imgur.com/dqopYB9b.jpg' },
  { citizenid: 'AF30442', firstname: 'Billy', lastname: 'Bob', incidentid: 3, expiresAt: Date.now(), image: 'https://i.imgur.com/dqopYB9b.jpg' },
  { citizenid: 'AF30442', firstname: 'Billy', lastname: 'Bob', incidentid: 3, expiresAt: Date.now(), image: 'https://i.imgur.com/dqopYB9b.jpg' },
];

type RecentActivityStore = {
  warrants: Warrant[];
  setWarrants: (warrants: Warrant[]) => void;
  getWarrants: () => Promise<{ warrants: Warrant[] }>;
};

const useWarrantStore = create<RecentActivityStore>((set) => ({
  warrants: isEnvBrowser() ? DEBUG_WARRANTS : [],
  getWarrants: async () => {
    try {
      const resp = await fetchNui<Warrant[]>('getWarrants');
      set({ warrants: resp });
      return { warrants: resp };
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      return { warrants: [] }; 
    }
  },
  setWarrants: (warrants) => set({ warrants }),
}));

export default useWarrantStore;