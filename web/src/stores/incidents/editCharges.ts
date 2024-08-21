import { create } from 'zustand';
import { SelectedCharge } from '../../typings';

interface ChargesStoreState {
  selectedCharges: SelectedCharge[];
  setSelectedCharges: (update: SelectedCharge[] | ((prev: SelectedCharge[]) => SelectedCharge[])) => void;
  setSelectedCharge: (label: string, update: (charge: SelectedCharge) => SelectedCharge) => void;
}

const useSelectedChargesStore = create<ChargesStoreState>((set) => ({
  selectedCharges: [],

  setSelectedCharges: (update) => set((state) => ({
    selectedCharges: typeof update === 'function' ? update(state.selectedCharges) : update
  })),

  setSelectedCharge: (label, update) => {
    set((state) => ({
      selectedCharges: state.selectedCharges.map(charge =>
        charge.label === label ? update(charge) : charge
      )
    }));
  },
}));

export default useSelectedChargesStore;