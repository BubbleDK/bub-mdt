import { create } from 'zustand'
import { Units, UnitData } from '../typings'

export const useStoreUnit = create<Units>((set) => ({
  // Initial State
  units: [],
  // Methods for manipulating state
  addUnit: ({unitName, unitMembers, carModel, id}: UnitData) => {
    set((state) => ({
      units: [
        ...state.units,
        {
          unitName,
          unitMembers,
          carModel,
          id,
        } as UnitData,
      ],
    }));
  },
  removeUnit: (id: number) => {
    set((state) => ({
      units: state.units.filter((unit) => unit.id !== id),
    }));
  },
  setUnits: (units: UnitData[]) => {
    set(() => ({
      units: [
        ...units,
      ],
    }));
  },
}))