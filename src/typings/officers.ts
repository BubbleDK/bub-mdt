export type OfficerData = {
  citizenid: number,
  firstname: string,
  lastname: string,
  role: string,
  callsign: string,
  phone: string,
}

export type Officers = {
  officers: OfficerData[],
  addOfficer: ({}: OfficerData) => void;
  removeOfficer: (citizenid: number) => void;
  setOfficers: (officers: OfficerData[]) => void;
}