import {create} from 'zustand';
import { isEnvBrowser } from '../utils/misc';
import { Character } from '../typings';

const DEBUG_CHARACTER: Character = {
  citizenid: '1993201',
  firstname: 'Bubble',
  lastname: 'Test',
  role: 'Chief',
  image: 'https://i.imgur.com/P4uYdfu.jpeg',
  callSign: 103,
  unit: 1,
};

type PersonalDataState = {
  personalData: Character;
  setPersonalData: (data: Character | ((prev: Character) => Character)) => void;
};

const usePersonalDataStore = create<PersonalDataState>((set) => ({
  personalData: isEnvBrowser() ? DEBUG_CHARACTER : {
    citizenid: '',
    firstname: '',
    lastname: '',
    role: '',
    image: '',
    callSign: 0,
  },

  // Actions
  setPersonalData: (data) => set((state) => ({
    personalData: typeof data === 'function' ? data(state.personalData) : { ...state.personalData, ...data }
  })),
}));

export default usePersonalDataStore;