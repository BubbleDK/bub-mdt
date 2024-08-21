import { Officer } from './officer';

export interface RosterOfficer extends Officer {
  title: string;
  image?: string;
  apu: boolean;
  air: boolean;
  mc: boolean;
  k9: boolean;
  fto: boolean;
  lastActive: number;
}