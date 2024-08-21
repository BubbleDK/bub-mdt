export interface Officer {
  firstname: string;
  lastname: string;
  callsign: string | number;
  citizenid: string;
  playerId: number;
  position: [number, number, number];
  unitId?: number;
}