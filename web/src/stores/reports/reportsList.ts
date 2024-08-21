import { create } from 'zustand';
import { fetchNui } from '../../utils/fetchNui';
import { isEnvBrowser } from '../../utils/misc';
import { PartialReportData } from '../../typings';

// Define the state and actions for your store
interface ReportsStoreState {
  reports: PartialReportData[];
  fetchReports: () => Promise<void>;
}

const DEBUG_REPORTS: PartialReportData[] = [];

for (let i = 0; i < 25; i++) {
  DEBUG_REPORTS[i] = {
    title: `Report ${i + 1}`,
    id: i,
    author: 'Some One',
    date: Date.now(),
  };
}

const getReports = async (): Promise<PartialReportData[]> => {
  if (isEnvBrowser()) return DEBUG_REPORTS;

  const resp = await fetchNui<PartialReportData[]>('getReports');

  return resp;
};

const useReportListStore = create<ReportsStoreState>((set) => ({
  reports: [],
  
  fetchReports: async () => {
    const fetchedReports = await getReports();
    set({ reports: fetchedReports });
  },
}));

export default useReportListStore;