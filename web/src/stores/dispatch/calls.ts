import { create } from 'zustand';
import { Call, Unit } from '../../typings';
import { isEnvBrowser } from '../../utils/misc';
import { CallsResponse, convertCalls } from '../../helpers';
import { fetchNui } from '../../utils/fetchNui';

const DEBUG_CALLS: Call[] = [
  {
    id: 1,
    time: Date.now(),
    location: 'Somewhere',
    coords: [350, 350],
    linked: false,
    offense: 'Bank robbery',
    code: '10-29',
    blip: 162,
    units: [
      {
        name: 'Unit 132',
        type: 'car',
        members: [
          { firstname: 'Billy', lastname: 'Bob', callsign: 132, citizenid: '321553', playerId: 1, position: [0, 0, 0] },
        ],
        id: 132,
      },
      {
        name: 'Unit 322',
        type: 'heli',
        members: [
          { firstname: 'Marc', lastname: 'Marshall', callsign: 322, citizenid: '451503', playerId: 1, position: [0, 0, 0] },
        ],
        id: 322,
      },
    ],
  },
  {
    id: 2,
    time: Date.now(),
    location: 'Somewhere',
    info: [
      { label: 'Sultan RS', icon: 'gun' },
      { label: 'XYZ 123', icon: 'badge-tm' },
    ],
    coords: [255, 150],
    blip: 51,
    linked: false,
    offense: 'Officer Down',
    code: '10-13',
    units: [
      {
        name: 'Unit 132',
        type: 'car',
        members: [
          { firstname: 'Billy', lastname: 'Bob', callsign: 132, citizenid: '311342', playerId: 1, position: [0, 0, 0] },
          { firstname: 'Martin', lastname: 'Contreras', callsign: 521, citizenid: '912132', playerId: 1, position: [0, 0, 0] },
        ],
        id: 132,
      },
      {
        name: 'Unit 823',
        type: 'heli',
        members: [
          { firstname: 'Bobby', lastname: 'Hopkins', callsign: 823, citizenid: '100341', playerId: 1, position: [0, 0, 0] },
        ],
        id: 823,
      },
      {
        name: 'Unit 531',
        type: 'motor',
        members: [
          { firstname: 'Connor', lastname: 'Collins', callsign: 531, citizenid: '913213', playerId: 1, position: [0, 0, 0] },
        ],
        id: 531,
      },
      {
        name: 'Unit 274',
        type: 'boat',
        members: [
          { firstname: 'Corey', lastname: 'Hayes', callsign: 274, citizenid: '920132', playerId: 1, position: [0, 0, 0] },
        ],
        id: 274,
      },
    ],
  },
  {
    id: 3,
    time: Date.now(),
    location: 'Somewhere',
    coords: [500, 750],
    linked: false,
    blip: 310,
    offense: 'Officer Down',
    code: '10-13',
    units: [
      {
        name: 'Unit 1',
        type: 'car',
        members: [
          { firstname: 'Billy', lastname: 'bob', callsign: 132, citizenid: '913213', playerId: 1, position: [0, 0, 0] },
        ],
        id: 136,
      },
      {
        name: 'Unit 6',
        type: 'heli',
        members: [
          { firstname: 'Freddie', lastname: 'Reid', callsign: 823, citizenid: '920132', playerId: 2, position: [0, 0, 0] },
        ],
        id: 823,
      },
    ],
  },
];

interface CallsStore {
  calls: Call[];
  fetchCalls: () => Promise<void>;
  updateCallUnits: (callId: number, units: Unit[]) => void;
  addCall: (newCall: Call) => void;
  setCalls: (newCalls: Call[]) => void;
}

const getCalls = async (): Promise<Call[]> => {
  if (isEnvBrowser()) return DEBUG_CALLS;

  const resp = await fetchNui<{ [key: string]: CallsResponse }>('getCalls');

  return convertCalls(resp);
};

export const useCallsStore = create<CallsStore>((set) => ({
  calls: [],

  fetchCalls: async () => {
    const fetchedCalls = await getCalls();
    set({ calls: fetchedCalls });
  },

  updateCallUnits: (callId, units) => {
    set(state => {
      const index = state.calls.findIndex(call => call.id === callId);
      if (index === -1) return state;
      const newCalls = [...state.calls];
      newCalls[index] = {...newCalls[index], units};
      return { calls: newCalls };
    });
  },

  addCall: (newCall) => {
    set(state => ({ calls: [newCall, ...state.calls] }));
  },

  setCalls: (newCalls) => set({ calls: newCalls }),
}));

export const useCalls = () => useCallsStore((state) => state.calls);
export const useFetchCalls = () => useCallsStore((state) => state.fetchCalls);
