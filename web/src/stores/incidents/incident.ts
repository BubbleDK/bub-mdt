import { create } from 'zustand';
import { Criminal, Evidence, Incident, Officer } from '../../typings';
import { isEnvBrowser } from '../../utils/misc';

interface IncidentStoreState {
  incident: Incident;
  isIncidentActive: boolean;
  setActiveIncident: (newIncident: Incident) => void;
  updateIncidentField: <K extends keyof Report>(field: K, value: Report[K]) => void;
  setIncidentActive: (bool: boolean) => void;
  setDescription: (description: string) => void;
  setCriminals: (update: Criminal[] | ((prevCriminals: Criminal[]) => Criminal[])) => void;
  setCriminal: (citizenid: string, update: Criminal | ((prevCriminal: Criminal) => Criminal)) => void;
  setOfficersInvolved: (update: Officer[] | ((prevOfficers: Officer[]) => Officer[])) => void;
  setEvidence: (update: Evidence[] | ((prevEvidence: Evidence[]) => Evidence[])) => void;
}

export const DEBUG_INCIDENT: Incident = {
  title: 'Debug Incident title',
  id: 0,
  description: '<p>This is a incident description</p>',
  officersInvolved: [
    {
      firstname: 'Callum',
      lastname: 'Graham',
      callsign: 188,
      citizenid: '132142',
      playerId: 1,
      position: [0, 0, 0],
    },
    {
      firstname: 'Jacob',
      lastname: 'Gray',
      callsign: 273,
      citizenid: '152312',
      playerId: 1,
      position: [0, 0, 0],
    },
    {
      firstname: 'Edward',
      lastname: 'Atkinson',
      callsign: 125,
      citizenid: '948213',
      playerId: 1,
      position: [0, 0, 0],
    },
  ],
  evidence: [],
  criminals: [
    {
      firstname: 'Archie',
      lastname: 'Moss',
      dob: Date.now(),
      issueWarrant: false,
      processed: false,
      pleadedGuilty: false,
      citizenid: '0',
      charges: [],
      penalty: {
        time: 0,
        fine: 0,
        reduction: null,
        points: 0,
      },
    },
  ],
};

const useIncidentStore = create<IncidentStoreState>((set) => ({
  incident: DEBUG_INCIDENT,

  isIncidentActive: false,

  setActiveIncident: (newIncident) => {
    if (isEnvBrowser()) set({ incident: DEBUG_INCIDENT });

    set({ incident: newIncident })
  },

  updateIncidentField: (field, value) => {
    set(state => ({ incident: { ...state.incident, [field]: value } }));
  },

  setIncidentActive: (bool) => {
    set({ isIncidentActive: bool });
  },

  setDescription: (description) => {
    set(state => ({ incident: { ...state.incident, description } }));
  },

  setCriminals: (update) => {
    set((state) => ({
      incident: {
        ...state.incident,
        criminals: typeof update === 'function' ? update(state.incident.criminals) : update
      }
    }));
  },

  setCriminal: (citizenid, update) => {
    set(state => {
      const criminals = state.incident.criminals.map(criminal => {
        if (criminal.citizenid === citizenid) {
          return typeof update === 'function' ? update(criminal) : { ...criminal, ...update };
        }
        return criminal;
      });
      return { incident: { ...state.incident, criminals } };
    });
  },

  setOfficersInvolved: (update) => {
    set((state) => ({
      incident: {
        ...state.incident,
        officersInvolved: typeof update === 'function' ? update(state.incident.officersInvolved) : update
      }
    }));
  },

  setEvidence: (update) => {
    set((state) => ({
      incident: {
        ...state.incident,
        evidence: typeof update === 'function' ? update(state.incident.evidence) : update
      }
    }));
  },
}));

export default useIncidentStore;