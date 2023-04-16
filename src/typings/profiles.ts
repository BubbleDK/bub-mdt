export type ProfileData = {
  citizenid: string,
  firstname: string,
  lastname: string,
  birthdate: string,
  gender: string,
  nationality: string,
  phone: string,
  job: string,
  tags: TagData[],
  relatedIncidents: number[],
  image: string,
  notes: string,
}

export type TagData = {
  value: string, 
  label: string, 
  backgroundcolor: string,
}

export type Profiles = {
  profiles: ProfileData[]
  selectedProfile: ProfileData | null;
  setProfile: (data: ProfileData | null) => void;
  setProfiles: ({}: ProfileData[]) => void;
}