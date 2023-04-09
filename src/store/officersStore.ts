import { create } from 'zustand'
import { OfficerData, Officers } from '../typings'

export const useStoreOfficers = create<Officers>((set) => ({
  // Initial State
  officers: [],
  // Methods for manipulating state
  addOfficer: ({id, firstname, lastname, role, callsign, phone}: OfficerData) => {
    set((state) => ({
      officers: [
        ...state.officers,
        {
          id, 
          firstname, 
          lastname, 
          role, 
          callsign, 
          phone,
        } as OfficerData,
      ],
    }));
  },
  removeOfficer: (id: number) => {
    set((state) => ({
      officers: state.officers.filter((officer) => officer.id !== id),
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