import { create } from 'zustand'
import produce from "immer";
import { ProfileData, Profiles } from '../typings';

export const useStoreProfiles = create<Profiles>((set, get) => ({
  profiles: [],
  selectedProfile: null,

  setProfiles: (profiles: ProfileData[]) => {
    set(() => ({
      profiles: [...profiles],
    }));
  },

  setProfile: (profile: ProfileData | null) => {
    set(() => ({
      selectedProfile: profile,
    }));
  },

  findProfileByCitizenId: (citizenid?: string) => {
    set((state) => ({
      selectedProfile: state.profiles.find((profile) => profile.citizenid === citizenid) || null
    }));
  },

  replaceProfile: (updatedProfile: ProfileData) => {
    set((state) => ({
      profiles: state.profiles.map((profile) =>
        profile.citizenid === updatedProfile.citizenid ? updatedProfile : profile
      ),
      selectedProfile: state.selectedProfile?.citizenid === updatedProfile.citizenid ? updatedProfile : state.selectedProfile,
    }));
  },

  getProfile: (citizenid: string): ProfileData | null => {
    const { profiles } = get();
    return profiles.find(profile => profile.citizenid === citizenid) || null;
  },
}))