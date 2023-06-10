import { ChargesData } from "./charges";
import { OfficerData } from "./officers";
import { ProfileData, TagData } from "./profiles";

export type IncidentData = {
  id: number,
  title: string,
  details: string,
  tags: TagData[],
  involvedOfficers: OfficerData[],
  involvedCivilians: ProfileData[],
  evidence: string,
  involvedCriminals: involvedCriminalsType[],
  timeStamp: Date,
  createdBy: OfficerData,
}

export type involvedCriminalsType = { 
  citizenId: string, 
  charges: ChargesData[], 
  isWarrantForArrestActive: boolean, 
  final: string, 
  pleadedGuilty: boolean, 
  processed: boolean 
}

export type Incidents = {
  incidents: IncidentData[]
  selectedIncident: IncidentData | null;
  setIncident: (data: IncidentData | null) => void;
  setIncidents: ({}: IncidentData[]) => void;
  getIncident: (id: number) => IncidentData | null;
}