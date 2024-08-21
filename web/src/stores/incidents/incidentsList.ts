import { create } from 'zustand';
import { fetchNui } from '../../utils/fetchNui';
import { isEnvBrowser } from '../../utils/misc';
import { PartialIncidentData } from '../../typings/incident';

// Define the state and actions for your store
interface IncidentsStoreState {
  incidents: PartialIncidentData[];
  fetchIncidents: () => Promise<void>;
  setIncidents: (update: PartialIncidentData[] | ((prevIncidents: PartialIncidentData[]) => PartialIncidentData[])) => void;
}

const DEBUG_INCIDENTS: PartialIncidentData[] = [];

for (let i = 0; i < 25; i++) {
  DEBUG_INCIDENTS[i] = {
    title: `Incident ${i + 1}`,
    id: i,
    author: 'Some One',
    date: Date.now(),
  };
}

const getIncidents = async (): Promise<{ incidents: PartialIncidentData[] }> => {
  if (isEnvBrowser()) {
    return {
      incidents: DEBUG_INCIDENTS,
    };
  }
  return await fetchNui<{ incidents: PartialIncidentData[] }>('getIncidents');
};

const useIncidentsStore = create<IncidentsStoreState>((set) => ({
  incidents: [],

  fetchIncidents: async () => {
    const data = await getIncidents();
    set({
      incidents: data.incidents,
    });
  },

  setIncidents: (update) => {
    set((state) => ({
      incidents: typeof update === 'function' ? update(state.incidents) : update
    }));
  },
}));

export default useIncidentsStore;