import { create } from 'zustand'
import produce from "immer";
import { Incidents, IncidentData } from '../typings';

export const useStoreIncidents = create<Incidents>((set) => ({
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
}));