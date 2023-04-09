import { OfficerData } from "./officers";

export type UnitData = {
  id: number,
  unitName: string,
  unitMembers: OfficerData[],
  carModel: string,
}

export type Units = {
  units: UnitData[],
  addUnit: ({}: UnitData) => void;
  removeUnit: (id: number) => void;
  setUnits: (units: UnitData[]) => void;
}