import { create } from 'zustand'
import { OfficerData } from '../typings';

export type PersonalActions = {
  setPersonalData: (data: OfficerData) => void;
}

const initialState: OfficerData = {
  citizenid: 0,
  firstname: '',
  lastname: '',
  role: '',
  callsign: '',
  phone: '',
}

export const useStorePersonal = create<OfficerData & PersonalActions>((set) => ({
  ...initialState,

  setPersonalData: (data: OfficerData) => {
    set({ citizenid: data.citizenid, firstname: data.firstname, lastname: data.lastname, role: data.role, callsign: data.callsign, phone: data.phone })
  },
}))