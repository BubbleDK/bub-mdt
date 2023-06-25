import { create } from 'zustand'
import produce from "immer";
import { Incidents, IncidentData, involvedCriminalsType, ChargesData } from '../typings';
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

  addCriminal: (criminal: involvedCriminalsType) => {
    set(state => produce(state, draft => {
      const incidentToUpdate = draft.selectedIncident ? draft.selectedIncident : draft.newIncident;

      const isCriminalAlreadyAdded = incidentToUpdate.involvedCriminals.some(c => c.citizenId === criminal.citizenId);
      if (!isCriminalAlreadyAdded) {
        incidentToUpdate.involvedCriminals.push(criminal);
      } else {
        console.log("The criminal is already added!");
      }
    }));
  },
  
  removeCriminal: (citizenId: string) => {
    set(state => produce(state, draft => {
      const incidentToUpdate = draft.selectedIncident ? draft.selectedIncident : draft.newIncident;
      
      const criminalIndex = incidentToUpdate.involvedCriminals.findIndex(c => c.citizenId === citizenId);
      if (criminalIndex !== -1) {
        incidentToUpdate.involvedCriminals.splice(criminalIndex, 1);
      } else {
        console.log("Criminal not found!");
      }
    }));
  },
  
  addChargeToCriminal: (citizenId: string, charge: ChargesData) => {
    set(state => produce(state, draft => {
      const incidentToUpdate = draft.selectedIncident ? draft.selectedIncident : draft.newIncident;
      const involvedCriminal = incidentToUpdate.involvedCriminals.find(c => c.citizenId === citizenId);

      if (involvedCriminal) {
        const existingCharge = involvedCriminal.charges.find(c => c.id === charge.id);
        if (existingCharge) {
          existingCharge.amountOfAddedCharges += 1;
        } else {
          involvedCriminal.charges.push(charge);
        }
      } else {
        console.log("The criminal is not involved in this incident!");
      }
    }));
  },
  
  setCriminalPleadedGuilty: (citizenId: string, pleadedGuilty: boolean) => {
    set(state => produce(state, draft => {
      const incidentToUpdate = draft.selectedIncident ? draft.selectedIncident : draft.newIncident;
      const involvedCriminal = incidentToUpdate.involvedCriminals.find(c => c.citizenId === citizenId);

      if (involvedCriminal) {
        involvedCriminal.pleadedGuilty = pleadedGuilty;
      } else {
        console.log("The criminal is not involved in this incident!");
      }
    }));
  },
  
  setCriminalProcessed: (citizenId: string, processed: boolean) => {
    set(state => produce(state, draft => {
      const incidentToUpdate = draft.selectedIncident ? draft.selectedIncident : draft.newIncident;
      const involvedCriminal = incidentToUpdate.involvedCriminals.find(c => c.citizenId === citizenId);

      if (involvedCriminal) {
        involvedCriminal.processed = processed;
      } else {
        console.log("The criminal is not involved in this incident!");
      }
    }));
  },

  saveIncident: () => {
    let savedIncidentId: number = -1;
  
    set(state => produce(state, draft => {
      if (state.selectedIncident) {
        const existingIncidentIndex = draft.incidents.findIndex(incident => incident.id === state.selectedIncident?.id);
        if (existingIncidentIndex !== -1) {
          draft.incidents[existingIncidentIndex] = state.selectedIncident;
          savedIncidentId = draft.incidents[existingIncidentIndex].id;
        }
      } else {
        draft.incidents.push(state.newIncident);
        savedIncidentId = draft.incidents[draft.incidents.length - 1].id;
      }

      draft.newIncident = initialNewIncident;
      draft.selectedIncident = null;
    }));
  
    return savedIncidentId;
  },
}));