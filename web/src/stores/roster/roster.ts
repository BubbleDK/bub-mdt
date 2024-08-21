import { create } from 'zustand';
import { RosterOfficer } from '../../typings';
import { isEnvBrowser } from '../../utils/misc';
import { fetchNui } from '../../utils/fetchNui';

const DEBUG_ROSTEROFFICERS: RosterOfficer[] = [
  {
    firstname: 'John',
    lastname: 'Doe',
    callsign: '1A-01',
    citizenid: 'ABCD1234',
    playerId: 1,
    position: [0, 0, 0],
    unitId: 1,
    image: '',
    title: 'Chief',
    apu: true,
    air: true,
    mc: true,
    k9: true,
    fto: true,
    lastActive: Date.now(),
  },
  {
    firstname: 'Jenna',
    lastname: 'Doe',
    callsign: '1A-02',
    citizenid: 'ABCD1235',
    playerId: 2,
    position: [0, 0, 0],
    image: '',
    title: 'Captain',
    apu: false,
    air: true,
    mc: true,
    k9: false,
    fto: false,
    lastActive: Date.now(),
  },
];

type RosterStore = {
  rosterOfficers: RosterOfficer[];
  setRosterOfficers: (update: RosterOfficer[] | ((prevCriminals: RosterOfficer[]) => RosterOfficer[])) => void;
  getRosterOfficers: () => Promise<{ rosterOfficers: RosterOfficer[] }>;
};

const useRosterStore = create<RosterStore>((set) => ({
  rosterOfficers: isEnvBrowser() ? DEBUG_ROSTEROFFICERS : [],
  getRosterOfficers: async () => {
    try {
      const resp = await fetchNui<RosterOfficer[]>('fetchRoster');
      set({ rosterOfficers: resp });
      return { rosterOfficers: resp };
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      return { rosterOfficers: [] }; 
    }
  },
  setRosterOfficers: (update) => {
    set((state) => ({
      rosterOfficers: typeof update === 'function' ? update(state.rosterOfficers) : update
    }));
  },
}));

export default useRosterStore;