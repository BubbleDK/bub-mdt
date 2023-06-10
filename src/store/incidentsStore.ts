import { create } from 'zustand'
import produce from "immer";
import { Incidents, IncidentData } from '../typings';

export const useStoreIncidents = create<Incidents>((set, get) => ({
  incidents: [],
  selectedIncident: null,

  setIncidents: (incidents: IncidentData[]) => {
    set(() => ({
      incidents: [...incidents],
    }));
  },

  setIncident: (incident: IncidentData | null) => {
    set(() => ({
      selectedIncident: incident,
    }));
  },

  getIncident: (id: number): IncidentData | null => {
    const { incidents } = get();
    return incidents.find(incident => incident.id === id) || null;
  },
}));