import { ChargesData } from "./charges";
import { OfficerData } from "./officers";
import { ProfileData, TagData } from "./profiles";

export type IncidentData = {
  id: number;
  title: string;
  details: string;
  location: string;
  tags: TagData[];
  involvedOfficers: OfficerData[];
  involvedCivilians: ProfileData[];
  evidence: string;
  involvedCriminals: involvedCriminalsType[];
  timeStamp: Date;
  createdBy?: { citizenid: string; firstname: string; lastname: string; };
}

export type involvedCriminalsType = { 
  citizenId: string;
  charges: ChargesData[];
  isWarrantForArrestActive: boolean;
  final: string;
  pleadedGuilty: boolean; 
  processed: boolean;
}

export type Incidents = {
  incidents: IncidentData[];
  selectedIncident: IncidentData | null;
  newIncident: IncidentData;
  resetNewIncident: () => void;
  setIncident: (data: IncidentData | null) => void;
  setIncidents: ({}: IncidentData[]) => void;
  getIncident: (id: number) => IncidentData | null;
  addCriminal: (criminal: involvedCriminalsType) => void;
  createNewIncident: (title: string, details: string, location: string) => number;
  removeCriminal: (citizenId: string) => void;
  addChargeToCriminal: (citizenId: string, charge: ChargesData) => void;
}