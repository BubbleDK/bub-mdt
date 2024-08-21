import { create } from 'zustand';
import { Unit } from '../../typings';
import { isEnvBrowser } from '../../utils/misc';
import { fetchNui } from '../../utils/fetchNui';

const DEBUG_UNITS: Unit[] = [
  {
    name: 'Unit 1',
    members: [
      {
        firstname: 'John',
        lastname: 'Doe',
        callsign: '1A-01',
        citizenid: 'ABCD1234',
        playerId: 1,
        position: [0, 0, 0],
        unitId: 1,
      }
    ],
    type: 'car',
    id: 1,
  },
  // Add more units as needed
];

interface UnitStore {
  units: Unit[];
  fetchUnits: () => Promise<void>;
  setUnits: (newUnits: Unit[]) => void;
}

const useUnitStore = create<UnitStore>((set) => ({
  units: [],

  fetchUnits: async () => {
    if (isEnvBrowser()) {
      set({ units: DEBUG_UNITS });
    } else {
      const resp = await fetchNui<{ [key: string]: Omit<Unit, 'id'> }>('getUnits');
      const units = Object.entries(resp).map(([id, unitData]) => ({
        id: parseInt(id),
        ...unitData
      }));
      set({ units });
    }
  },

  setUnits: (newUnits) => set({ units: newUnits }),
}));

export default useUnitStore;