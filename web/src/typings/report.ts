import { Evidence } from "./incident";
import { Officer } from "./officer";
import { PartialProfileData } from "./profile";

export interface Report {
  title: string;
  id: number;
  description?: string;
  officersInvolved: Officer[];
  citizensInvolved: PartialProfileData[];
  evidence: Evidence[];
}

export interface PartialReportData {
  title: string;
  author: string;
  date: number;
  id: number;
}