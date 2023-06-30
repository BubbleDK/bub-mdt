export type ReportData = {
  id: number,
  title: string,
  category: string,
  timeCreated: Date,
  createdBy: {citizenId: string, firstname: string, lastname: string},
}

export type Reports = {
  reports: ReportData[]
  selectedReport: ReportData | null;
  setReport: (data: ReportData | null) => void;
  setReports: ({}: ReportData[]) => void;
  getReport: (id: number) => ReportData | null;
}