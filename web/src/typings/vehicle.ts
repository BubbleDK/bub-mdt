export interface Vehicle extends PartialVehicleData {
  owner: string;
  color: string;
  notes?: string;
  class: string;
  image?: string;
  knownInformation: string[];
}

export interface PartialVehicleData {
  plate: string;
  model: string;
}