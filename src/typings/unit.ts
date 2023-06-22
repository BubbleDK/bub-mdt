import { OfficerData } from "./officers";

export type UnitData = {
  id: number,
  unitName: string,
  unitMembers: OfficerData[],
  carModel: string,
  isOwner: number,
}

export type Units = {
  units: UnitData[],
  addUnit: ({}: UnitData) => void;
  removeUnitMember: (unitId: number, citizenid: string) => void;
  deleteUnit: (id: number) => void;
  setUnits: (units: UnitData[]) => void;
  getUnitMemberCount: (unitId: number) => number;
  getUnitByOfficer: (officerCitizenid: string) => UnitData | undefined;
}