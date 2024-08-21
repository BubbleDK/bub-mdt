import { create } from 'zustand';
import { fetchNui } from '../../utils/fetchNui';
import { CriminalProfile } from '../../typings';
import { isEnvBrowser } from '../../utils/misc';

interface CriminalProfileStoreState {
  criminalProfiles: CriminalProfile[];
  getCriminalProfiles: () => void;
  setCriminalProfiles: (criminalProfiles: CriminalProfile[]) => void;
}

const DEBUG_CRIMINALPROFILES: CriminalProfile[] = [
  { firstname: 'John', lastname: 'Doe', dob: Date.now(), citizenid: '12345' },
  { firstname: 'Jane', lastname: 'Smith', dob: Date.now(), citizenid: '67890' },
  { firstname: 'David', lastname: 'Williams', dob: Date.now(), citizenid: '13579' },
  { firstname: 'Samantha', lastname: 'Jones', dob: Date.now(), citizenid: '24680' },
  { firstname: 'Robert', lastname: 'Garcia', dob: Date.now(), citizenid: '97531' },
  { firstname: 'Emily', lastname: 'Brown', dob: Date.now(), citizenid: '11223' },
  { firstname: 'Michael', lastname: 'Davis', dob: Date.now(), citizenid: '33445' },
  { firstname: 'Sarah', lastname: 'Wilson', dob: Date.now(), citizenid: '55667' },
  { firstname: 'James', lastname: 'Taylor', dob: Date.now(), citizenid: '77889' },
  { firstname: 'Laura', lastname: 'Moore', dob: Date.now(), citizenid: '99001' },
  { firstname: 'Kevin', lastname: 'Martin', dob: Date.now(), citizenid: '12321' },
  { firstname: 'Jessica', lastname: 'Lee', dob: Date.now(), citizenid: '34543' },
  { firstname: 'Daniel', lastname: 'Perez', dob: Date.now(), citizenid: '56765' },
  { firstname: 'Nancy', lastname: 'White', dob: Date.now(), citizenid: '78987' },
  { firstname: 'Steven', lastname: 'Harris', dob: Date.now(), citizenid: '90109' },
  { firstname: 'Lisa', lastname: 'Clark', dob: Date.now(), citizenid: '12212' },
  { firstname: 'Paul', lastname: 'Rodriguez', dob: Date.now(), citizenid: '34434' },
  { firstname: 'Anna', lastname: 'Lewis', dob: Date.now(), citizenid: '56656' },
  { firstname: 'Charles', lastname: 'Walker', dob: Date.now(), citizenid: '78878' },
  { firstname: 'Susan', lastname: 'Allen', dob: Date.now(), citizenid: '90090' }
];

const useCriminalProfileStore = create<CriminalProfileStoreState>((set) => ({
  criminalProfiles: isEnvBrowser() ? DEBUG_CRIMINALPROFILES : [],
  getCriminalProfiles: async () => {
    const criminalProfiles = await fetchNui('getCriminalProfiles', { data: DEBUG_CRIMINALPROFILES, delay: 300 });
    set({ criminalProfiles })
  },
  setCriminalProfiles: (criminalProfiles) => set({ criminalProfiles }),
}));

export default useCriminalProfileStore;