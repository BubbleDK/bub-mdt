import { create } from 'zustand';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

export interface RecentActivityType { 
  type: string; 
  category: string; 
  firstname: string; 
  lastname: string; 
  date: string; 
  activityid: number; 
  citizenid: string; 
}

const DEBUG_RECENTACTIVITY: RecentActivityType[] = [
  { type: 'created', category: 'profiles', firstname: 'Bubble', lastname: 'Test', date: 'string', activityid: 1, citizenid: 'BUB193Z4A' },
  { type: 'updated', category: 'profiles', firstname: 'Bubble', lastname: 'Test', date: 'string', activityid: 1, citizenid: 'BUB193Z4A' },
  { type: 'deleted', category: 'profiles', firstname: 'Bubble', lastname: 'Test', date: 'string', activityid: 1, citizenid: 'BUB193Z4A' },
  { type: 'created', category: 'incidents', firstname: 'Bubble', lastname: 'Test', date: 'string', activityid: 1, citizenid: 'BUB193Z4A' },
  { type: 'created', category: 'profiles', firstname: 'Bubble', lastname: 'Test', date: 'string', activityid: 1, citizenid: 'BUB193Z4A' },
  { type: 'created', category: 'profiles', firstname: 'Bubble', lastname: 'Test', date: 'string', activityid: 1, citizenid: 'BUB193Z4A' },
  { type: 'created', category: 'profiles', firstname: 'Bubble', lastname: 'Test', date: 'string', activityid: 1, citizenid: 'BUB193Z4A' },
  { type: 'created', category: 'profiles', firstname: 'Bubble', lastname: 'Test', date: 'string', activityid: 1, citizenid: 'BUB193Z4A' },
];

type RecentActivityStore = {
  recentActivity: RecentActivityType[];
  setRecentActivities: (recentActivity: RecentActivityType[]) => void;
  getRecentActivity: () => Promise<{ recentActivity: RecentActivityType[] }>;
};

const useRecentActivityStore = create<RecentActivityStore>((set) => ({
  recentActivity: isEnvBrowser() ? DEBUG_RECENTACTIVITY : [],
  getRecentActivity: async () => {
    try {
      const resp = await fetchNui<RecentActivityType[]>('getRecentActivity');
      set({ recentActivity: resp });
      return { recentActivity: resp };
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      return { recentActivity: [] }; 
    }
  },
  setRecentActivities: (recentActivity) => set({ recentActivity }),
}));

export default useRecentActivityStore;