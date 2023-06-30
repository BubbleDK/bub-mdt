import { create } from 'zustand'
import { Alerts, AlertData, UnitData } from '../typings'
import produce from "immer";

export const useStoreDispatch = create<Alerts>((set) => ({
  // Initial State
  alerts: [],
  // Methods for manipulating state
  addAlert: ({id, CoordsY, CoordsX, displayCode, alertName, location, time, gender, attachedUnits}: AlertData) => {
    set((state) => ({
      alerts: [
        ...state.alerts,
        {
          id,
          CoordsY,
          CoordsX,
          displayCode,
          alertName,
          location,
          time,
          gender,
          attachedUnits
        } as AlertData,
      ],
    }));
  },
  removeAlert: (id: number) => {
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
    }));
  },
  addUnitToAlert: (id: number, unit: UnitData) => 
    set(
      produce((state) => {
        const alert = state.alerts.find((el: AlertData) => el.id === id);
        const index = alert.attachedUnits.findIndex((x: UnitData) => x.unitName === unit.unitName)
        index === -1 ? alert.attachedUnits.push(unit) : console.log("Unit already attached to alert")
      })
    ),
  setAlerts: (alerts: AlertData[]) => {
    set(() => ({
      alerts: [
        ...alerts,
      ],
    }));
  },
  removeUnitFromAlert: (unitId: number) =>
  set(
    produce((state) => {
      state.alerts.forEach((alert: AlertData) => {
        alert.attachedUnits = alert.attachedUnits.filter((unit: UnitData) => unit.id !== unitId);
      });
    })
  ),
}))