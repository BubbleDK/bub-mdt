import { create } from 'zustand'
import produce from "immer";
import { Reports, ReportData } from '../typings';

export const useStoreReports = create<Reports>((set, get) => ({
  reports: [],
  selectedReport: null,

  setReports: (reports: ReportData[]) => {
    set(() => ({
      reports: [...reports],
    }));
  },

  setReport: (report: ReportData | null) => {
    set(() => ({
      selectedReport: report,
    }));
  },

  getReport: (id: number): ReportData | null => {
    const { reports } = get();
    return reports.find(report => report.id === id) || null;
  },
}));