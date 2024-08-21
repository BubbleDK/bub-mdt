import { Officer } from './officer';

export type UnitType = 'car' | 'motor' | 'heli' | 'boat';

export interface Call {
  id: number;
  offense: string;
  code: string;
  linked: boolean;
  coords: [number, number];
  blip: number;
  time: number;
  location: string;
  isEmergency?: boolean;
  info?: { label: string; icon: string }[];
  units: Unit[];
}

export interface Unit {
  id: number;
  name: string;
  members: Officer[];
  type: UnitType;
}

export type UnitsObject = { [key: string]: Omit<Unit, 'id'> };