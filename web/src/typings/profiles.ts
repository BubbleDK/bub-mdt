import { PropertyData } from "./properties"
import { VehicleData } from "./vehicles"

export type ProfileData = {
  citizenid: string,
  firstname: string,
  lastname: string,
  birthdate: string,
  gender: string,
  nationality: string,
  phone: string,
  employment: EmploymentData[],
  tags: TagData[],
  licenses: licenseData[],
  image: string,
  notes: string,
  properties: PropertyData[],
  vehicles: VehicleData[],
}

export type licenseData = {
  licenseType: string, 
  color: string,
}

export type TagData = {
  value: string, 
  label: string, 
  backgroundcolor: string,
}

export type EmploymentData = {
  companyName: string, 
  jobPosition: string,
}

export type Profiles = {
  profiles: ProfileData[]
  selectedProfile: ProfileData | null;
  setProfile: (data: ProfileData | null) => void;
  setProfiles: ({}: ProfileData[]) => void;
  findProfileByCitizenId: (citizenId?: string) => void;
  replaceProfile: (updatedProfile: ProfileData) => void;
  getProfile: (citizenid: string) => ProfileData | null;
}