import { Officer } from './officer';

interface AnnouncementCreator extends Officer {
  image?: string;
}

export interface Announcement extends AnnouncementCreator {
  id: number;
  contents: string;
  createdAt: number;
}