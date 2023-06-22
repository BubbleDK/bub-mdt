import { create } from 'zustand'
import produce from "immer";
import { Incidents, IncidentData, involvedCriminalsType } from '../typings';
import { useStorePersonal } from './personalInfoStore';

const initialNewIncident = {
  id: 0,
  title: "",
  details: "",
  location: '',
  tags: [],
  involvedOfficers: [],
  involvedCivilians: [],
  evidence: "",
  involvedCriminals: [],
  timeStamp: new Date(),
  createdBy: { 
    citizenid: '', 
    firstname: '', 
    lastname: '', 
  },
};

export const useStoreIncidents = create<Incidents>((set, get) => ({
  incidents: [],
  selectedIncident: null,
  newIncident: {...initialNewIncident},

  resetNewIncident: () => set(state => ({ ...state, newIncident: initialNewIncident })),

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

  addCriminal: (criminal: involvedCriminalsType) => {
    set(state => produce(state, draft => {
      const targetIncident = state.selectedIncident ?? state.newIncident;
      const isCriminalAlreadyAdded = targetIncident.involvedCriminals.some(c => c.citizenId === criminal.citizenId);
  
      if (isCriminalAlreadyAdded) {
        console.log("The criminal is already added!");
        return state;
      }
  
      if (state.selectedIncident) {
        const selectedIncidentIndex = draft.incidents.findIndex(incident => state.selectedIncident && incident.id === state.selectedIncident.id);
        if (selectedIncidentIndex !== -1) {
          draft.incidents[selectedIncidentIndex].involvedCriminals.push(criminal);
          draft.selectedIncident = draft.incidents[selectedIncidentIndex];
        }
      } else {
        draft.newIncident.involvedCriminals.push(criminal);
      }
    }));
  },

  removeCriminal: (citizenId: string) => {
    set(state => produce(state, draft => {
      if (state.selectedIncident) {
        const selectedIncidentIndex = draft.incidents.findIndex(incident => state.selectedIncident && incident.id === state.selectedIncident.id);
        if (selectedIncidentIndex !== -1) {
          draft.incidents[selectedIncidentIndex].involvedCriminals = draft.incidents[selectedIncidentIndex].involvedCriminals.filter(c => c.citizenId !== citizenId);
          draft.selectedIncident = draft.incidents[selectedIncidentIndex];
        }
      } else {
        draft.newIncident.involvedCriminals = draft.newIncident.involvedCriminals.filter(c => c.citizenId !== citizenId);
      }
    }));
  },

  createNewIncident: (title: string, details: string, location: string) => {
    let newIncidentId = -1;
    set(state =>
      produce(state, draft => {
        const maxId = Math.max(...state.incidents.map(incident => incident.id), 0);
        newIncidentId = maxId + 1;
        const officerData = useStorePersonal.getState();
        const newIncident = {
          ...state.newIncident,
          id: newIncidentId,
          title: title,
          details: details,
          location: location,
          timeStamp: new Date(),
          createdBy: { 
            citizenid: officerData.citizenid, 
            firstname: officerData.firstname, 
            lastname: officerData.lastname, 
          },
        };
        draft.incidents.push(newIncident);
        draft.newIncident = {...initialNewIncident};
      })
    );
    return newIncidentId;
  },
}));