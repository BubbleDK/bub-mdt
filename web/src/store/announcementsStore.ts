import { create } from 'zustand'
import { OfficerData } from '../typings';

export type AnnouncementData = {
  id: number,
  title: string,
  time: number,
  message: string,
  postedBy: OfficerData,
}

export type AnnouncementsActions = {
  announcements: AnnouncementData[];
  addAnnouncement: (data: AnnouncementData) => void;
  removeAnnouncement: (id: number) => void;
  setAnnouncements: (announcements: AnnouncementData[]) => void;
}

export const useStoreAnnouncements = create<AnnouncementsActions>((set) => ({
  announcements: [],
  addAnnouncement: ({id, title, time, message, postedBy}: AnnouncementData) => {
    set((state) => ({
      announcements: [
        ...state.announcements,
        {
          id,
          title,
          time,
          message,
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