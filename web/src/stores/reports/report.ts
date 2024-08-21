import { create } from 'zustand';
import { Evidence, Officer, PartialProfileData, Report } from '../../typings';
import { isEnvBrowser } from '../../utils/misc';

interface ReportStoreState {
  report: Report;
  isReportActive: boolean;
  setActiveReport: (newReport: Report) => void;
  setReportActive: (bool: boolean) => void;
  setDescription: (description: string) => void;
  setOfficersInvolved: (update: Officer[] | ((prevOfficers: Officer[]) => Officer[])) => void;
  setCitizensInvolved: (update: PartialProfileData[] | ((prevProfiles: PartialProfileData[]) => PartialProfileData[])) => void;
  setEvidence: (update: Evidence[] | ((prevEvidence: Evidence[]) => Evidence[])) => void;
}

export const DEBUG_REPORT: Report = {
  title: 'Debug Report title',
  id: 0,
  description: '<p>This is a incident description</p>',
  evidence: [],
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
  citizensInvolved: [
    {
      firstname: 'John',
      lastname: 'Doe',
      citizenid: 'BUB193Z4A',
      dob: Date.now(),
    },
  ],
};

const useReportStore = create<ReportStoreState>((set) => ({
  report: DEBUG_REPORT,

  isReportActive: false,

  setActiveReport: (newReport) => {
    if (isEnvBrowser()) set({ report: DEBUG_REPORT });

    set({ report: newReport })
  },

  setReportActive: (bool) => {
    set({ isReportActive: bool });
  },

  setDescription: (description) => {
    set(state => ({ report: { ...state.report, description } }));
  },

  setOfficersInvolved: (update) => {
    set((state) => ({
      report: {
        ...state.report,
        officersInvolved: typeof update === 'function' ? update(state.report.officersInvolved) : update
      }
    }));
  },

  setCitizensInvolved: (update) => {
    set((state) => ({
      report: {
        ...state.report,
        citizensInvolved: typeof update === 'function' ? update(state.report.citizensInvolved) : update
      }
    }));
  },

  setEvidence: (update) => {
    set((state) => ({
      report: {
        ...state.report,
        evidence: typeof update === 'function' ? update(state.report.evidence) : update
      }
    }));
  },
}));

export default useReportStore;