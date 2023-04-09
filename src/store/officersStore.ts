import { create } from 'zustand'
import { OfficerData, Officers } from '../typings'

export const useStoreOfficers = create<Officers>((set) => ({
  // Initial State
  officers: [],
  // Methods for manipulating state
  addOfficer: ({citizenid, firstname, lastname, role, callsign, phone}: OfficerData) => {
    set((state) => ({
      officers: [
        ...state.officers,
        {
          citizenid, 
          firstname, 
          lastname, 
          role, 
          callsign, 
          phone,
        } as OfficerData,
      ],
    }));
  },
  removeOfficer: (citizenid: number) => {
    set((state) => ({
      officers: state.officers.filter((officer) => officer.citizenid !== citizenid),
    }));
  },
  setOfficers: (officers: OfficerData[]) => {
    set(() => ({
      officers: [
        ...officers,
      ],
    }));
  },
}))