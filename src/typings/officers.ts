export type OfficerData = {
  citizenid: string,
  firstname: string,
  lastname: string,
  role: string,
  callsign: string,
  phone: string,
  image: string,
}

export type Officers = {
  officers: OfficerData[],
  addOfficer: ({}: OfficerData) => void;
  removeOfficer: (citizenid: string) => void;
  setOfficers: (officers: OfficerData[]) => void;
}