export type OfficerData = {
  id: number,
  firstname: string,
  lastname: string,
  role: string,
  callsign: string,
  phone: string,
}

export type Officers = {
  officers: OfficerData[],
  addOfficer: ({}: OfficerData) => void;
  removeOfficer: (id: number) => void;
  setOfficers: (officers: OfficerData[]) => void;
}