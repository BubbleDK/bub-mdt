import { ChargesData } from "./charges";
import { EvidenceData } from "./evidence";
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
  evidence: EvidenceData[];
  involvedCriminals: InvolvedCriminalsType[];
  timeStamp: Date;
  createdBy: { citizenid: string; firstname: string; lastname: string; };
}

export type InvolvedCriminalsType = { 
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
  addCriminal: (criminal: InvolvedCriminalsType) => void;
  createNewIncident: (title: string, details: string, location: string) => number;
  removeCriminal: (citizenId: string) => void;
  addChargeToCriminal: (citizenId: string, charge: ChargesData) => void;
  setCriminalPleadedGuilty: (citizenId: string, pleadedGuilty: boolean) => void;
  setCriminalProcessed: (citizenId: string, processed: boolean) => void;
  saveIncident: () => number;
}