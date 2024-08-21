export interface Profile extends PartialProfileData {
  notes?: string;
  fingerprint?: string;
  phoneNumber: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  relatedReports?: {
    title: string;
    author: string;
    date: string;
    id: number;
  }[];
  relatedIncidents?: {
    title: string;
    author: string;
    date: string;
    id: number;
  }[];
}

export interface PartialProfileData {
  firstname: string;
  lastname: string;
  dob: number;
  citizenid: string;
  image?: string;
}

export interface CustomProfileData {
  id: string;
  title: string;
  icon: string;
}