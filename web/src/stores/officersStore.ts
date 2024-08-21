import { create } from 'zustand';
import { fetchNui } from '../utils/fetchNui';
import { Officer } from '../typings';
import { isEnvBrowser } from '../utils/misc';

const DEBUG_OFFICERS: Officer[] = [
  {
    firstname: 'John',
    lastname: 'Doe',
    callsign: '1A-01',
    citizenid: 'ABCD1234',
    playerId: 1,
    position: [0, 0, 0],
    unitId: 1
  },
  {
    firstname: 'Jenna',
    lastname: 'Doe',
    callsign: '1A-02',
    citizenid: 'ABCD1235',
    playerId: 2,
    position: [0, 0, 0],
  },
];

type OfficerStore = {
  officers: Officer[];
  activeOfficers: Officer[];
  setOfficers: (officers: Officer[]) => void;
  addOfficer: (officer: Officer) => void;
  removeOfficer: (citizenid: string) => void;
  getOfficers: () => Promise<{ officers: Officer[] }>;
  getActiveOfficers: () => Promise<{ activeOfficers: Officer[] }>;
};

const useOfficerStore = create<OfficerStore>((set) => ({
  officers: isEnvBrowser() ? DEBUG_OFFICERS : [],
  activeOfficers: isEnvBrowser() ? DEBUG_OFFICERS : [],
  getOfficers: async () => {
    try {
      const resp = await fetchNui<Officer[]>('getOfficers');
      set({ officers: resp });
      return { officers: resp };
    } catch (error) {
      console.error('Failed to fetch officers:', error);
      return { officers: [] }; 
    }
  },
  getActiveOfficers: async () => {
    try {
      const resp = await fetchNui<Officer[]>('getActiveOfficers');
      const officersArray = Object.values(resp);
      set({ activeOfficers: officersArray });
      return { activeOfficers: officersArray };
    } catch (error) {
      console.error('Failed to fetch active officers:', error);
      return { activeOfficers: [] }; 
    }
  },
  setOfficers: (officers) => set({ officers }),
  addOfficer: (officer) => set((state) => ({ officers: [...state.officers, officer] })),
  removeOfficer: (citizenid) => set((state) => ({ officers: state.officers.filter(o => o.citizenid !== citizenid) }))
}));

export default useOfficerStore;