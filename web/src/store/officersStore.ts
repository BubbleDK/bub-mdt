import { create } from 'zustand'
import { OfficerData, Officers } from '../typings'

export const useStoreOfficers = create<Officers>((set) => ({
  officers: [],
  activeOfficers: [],
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
  removeOfficer: (citizenid: string) => {
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
  setActiveOfficers: (activeOfficers: OfficerData[]) => {
    set(() => ({
      activeOfficers: [
        ...activeOfficers,
      ],
    }));
  },
}))