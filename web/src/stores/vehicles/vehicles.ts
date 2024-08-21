import { create } from 'zustand';
import { PartialVehicleData, Vehicle } from '../../typings';
import { isEnvBrowser } from '../../utils/misc';
import { fetchNui } from '../../utils/fetchNui';

const DEBUG_VEHICLES: PartialVehicleData[] = [];

for (let i = 0; i < 25; i++) {
  DEBUG_VEHICLES[i] = {
    plate: `44HJJO263${i + 1}`,
    model: 'Adder',
  };
}

export const DEBUG_VEHICLE1: Vehicle = {
  plate: '44HJJO263',
  model: 'gauntlet2',
  owner: 'John Doe (ABC123AW)',
  color: 'Red',
  notes: 'string',
  class: 'Muscle',
  knownInformation: [
    'Gaunlet'
  ],
};

export const DEBUG_VEHICLE2: Vehicle = {
  plate: '44HJJO263',
  model: 'sultan3',
  owner: 'John Doe (ABC123AW)',
  color: 'Black',
  notes: 'string',
  class: 'Super',
  knownInformation: [
    'Adder'
  ],
};


type VehiclesStore = {
  selectedVehicle: Vehicle | null;
  isVehicleBOLO: boolean;
  BOLOExpirationDate: string;
  getVehicles: () => Promise<PartialVehicleData[]>;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  setIsVehicleBOLO: (bool: boolean) => void;
  setBOLOExpirationDate: (date: string) => void;
};

const useVehiclesStore = create<VehiclesStore>((set) => ({
  selectedVehicle: null,
  isVehicleBOLO: false,
  BOLOExpirationDate: '',
  getVehicles: async (): Promise<PartialVehicleData[]> => {
    if (isEnvBrowser()) {
      return DEBUG_VEHICLES;
    }

    return await fetchNui<PartialVehicleData[]>('getAllVehicles');
  },
  setSelectedVehicle: (vehicle: Vehicle | null) => { 
    if (isEnvBrowser()) set({ selectedVehicle: (Math.random() * 10) > 5 ? DEBUG_VEHICLE1 : DEBUG_VEHICLE2 });

    set({ selectedVehicle: vehicle })
  },
  setIsVehicleBOLO(bool) {
    set({ isVehicleBOLO: bool })
  },
  setBOLOExpirationDate(date) {
    set({ BOLOExpirationDate: date })
  }
}));

export default useVehiclesStore;