export type ProfileData = {
  citizenid: string,
  firstname: string,
  lastname: string,
  birthdate: string,
  gender: string,
  nationality: string,
  phone: string,
  job: string,
  tags: string[],
  relatedIncidents: number[],
  image: string,
}

export type Profiles = {
  profiles: ProfileData[]
  selectedProfile: ProfileData | null;
  setProfile: ({}: ProfileData) => void;
  setProfiles: ({}: ProfileData[]) => void;
}