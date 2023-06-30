import { create } from 'zustand'
import { OfficerData } from '../typings';

export type AnnouncementData = {
  id: number,
  title: string,
  time: number,
  content: string,
  postedBy: OfficerData,
}

export type AnnouncementsActions = {
  announcements: AnnouncementData[];
  addAnnouncement: (data: AnnouncementData) => void;
  removeAnnouncement: (id: number) => void;
  setAnnouncements: (announcements: AnnouncementData[]) => void;
}

export const useStoreAnnouncements = create<AnnouncementsActions>((set) => ({
  // Initial State
  announcements: [],
  // Methods for manipulating state
  addAnnouncement: ({id, title, time, content, postedBy}: AnnouncementData) => {
    set((state) => ({
      announcements: [
        ...state.announcements,
        {
          id,
          title,
          time,
          content,
          postedBy
        } as AnnouncementData,
      ],
    }));
  },
  removeAnnouncement: (id: number) => {
    set((state) => ({
      announcements: state.announcements.filter((alert) => alert.id !== id),
    }));
  },
  setAnnouncements: (announcements: AnnouncementData[]) => {
    set(() => ({
      announcements: [
        ...announcements,
      ],
    }));
  },
}))