import { create } from 'zustand'
import produce from "immer";
import { ProfileData, Profiles } from '../typings';

export const useStoreProfiles = create<Profiles>((set) => ({
  profiles: [],
  selectedProfile: null,

  setProfiles: (profiles: ProfileData[]) => {
    set(() => ({
      profiles: [...profiles],
    }));
  },

  setProfile: (profile: ProfileData) => {
    set(() => ({
      selectedProfile: profile,
    }));
  },
}))