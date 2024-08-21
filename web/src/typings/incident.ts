import { DateValue } from '@mantine/dates';
import { SelectedCharge } from './charges';
import { PartialProfileData } from './profile';
import { Officer } from './officer';

export interface Criminal extends CriminalProfile {
  charges: SelectedCharge[];
  issueWarrant: boolean;
  pleadedGuilty: boolean;
  processed: boolean;
  warrantExpiry?: DateValue;
  penalty: {
    time: number;
    fine: number;
    reduction: number | null;
    points: number;
  };
}

export type Evidence = {
  label: string;
  image: string;
};

export interface Incident {
  title: string;
  id: number;
  description?: string;
  officersInvolved: Officer[];
  evidence: Evidence[];
  criminals: Criminal[];
}

export interface PartialIncidentData {
  title: string;
  author: string;
  date: number;
  id: number;
}

export interface CriminalProfile extends PartialProfileData {}