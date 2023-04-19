import { create } from 'zustand'

export type Activity = { 
  category: string,
  type: string,
  doneBy: string,
  timeAgo: number,
  timeAgotext: string,
  activityID?: string,
};

type RecentActivityState = { 
  recentActivity: Activity[];
  addToRecentActivity: (activity: Activity) => void;
};

export const useRecentActivityStore = create<RecentActivityState>((set) => ({
  recentActivity: [],
  addToRecentActivity: (activity: Activity) => {
    set((state) => {
      const { recentActivity } = state;
      const newRecentActivity = [...recentActivity, activity];
      if (newRecentActivity.length > 8) {
        newRecentActivity.splice(0, 1);
      }
      return { recentActivity: newRecentActivity };
    });
  },
}));