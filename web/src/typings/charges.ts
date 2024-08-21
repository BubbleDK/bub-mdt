export interface Charge {
  label: string;
  type: 'misdemeanor' | 'felony' | 'infraction';
  description: string;
  time: number;
  fine: number;
  points: number;
}

export interface SelectedCharge extends Charge {
  count: number;
}