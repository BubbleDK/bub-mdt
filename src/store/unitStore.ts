import { create } from 'zustand'
import { Units, UnitData, OfficerData } from '../typings'
import produce from "immer";

export const useStoreUnit = create<Units>((set, get) => ({
  // Initial State
  units: [],
  // Methods for manipulating state
  addUnit: ({unitName, unitMembers, carModel, id, isOwner}: UnitData) => {
    set((state) => ({
      units: [
        ...state.units,
        {
          unitName,
          unitMembers,
          carModel,
          id,
          isOwner
        } as UnitData,
      ],
    }));
  },
  deleteUnit: (id: number) => {
    set((state) => ({
      units: [...state.units.filter((unit) => unit.id !== id)],
    }));
  },
  setUnits: (units: UnitData[]) => {
    set(() => ({
      units: [
        ...units,
      ],
    }));
  },
  removeUnitMember: (unitId: number, citizenid: number) => 
    set(
      produce((state) => {
        const unit = state.units.find((el: UnitData) => el.id === unitId);
        const removeIndex = unit.unitMembers.findIndex((member: OfficerData) => member.citizenid === citizenid)
        if (removeIndex === -1) {
          console.log("There is no unit member by that citizenid");
        } else {
          unit.unitMembers.splice(removeIndex, 1);
          if (unit.unitMembers.length === 0) {
            const unitIndex = state.units.findIndex((el: UnitData) => el.id === unitId);
            state.units.splice(unitIndex, 1);
          }
        }
      })
    ),
}))