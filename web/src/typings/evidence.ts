export type EvidenceData = {
  id: number;
  type: string;
  title: string;
  notes: string;
  involvedCitizens: string[];
  tags: string[];
  timeStamp: Date;
  createdBy: { citizenid: string; firstname: string; lastname: string; };
}

export type Evidence = {
  evidence: EvidenceData[];
  selectedEvidence: EvidenceData | null;
  newEvidence: EvidenceData;
}