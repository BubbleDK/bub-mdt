import { UnitData } from './unit'

export type AlertData = {
  id: number,
  CoordsY: number,
  CoordsX: number,
  displayCode: string,
  alertName: string,
  location: string,
  time: number,
  gender: string,
  attachedUnits: UnitData[],
}

export type Alerts = {
  alerts: AlertData[],
  addAlert: ({}: AlertData) => void;
  removeAlert: (id: number) => void;
  addUnitToAlert: (id: number, unit: UnitData) => void;
  setAlerts: ({}: AlertData[]) => void;
  removeUnitFromAlert: (unitId: number) => void;
}

export type DispatchAlerts = {
  alerts: AlertData[]
}

export type AlertTypes = {
  [index: string]: JSX.Element
}