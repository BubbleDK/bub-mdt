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
  involvedCriminals: ProfileData[],
  timeStamp: Date,
  createdBy: OfficerData,
}

export type Incidents = {
  incidents: IncidentData[]
  selectedIncident: IncidentData | null;
  setIncident: (data: IncidentData | null) => void;
  setIncidents: ({}: IncidentData[]) => void;
}