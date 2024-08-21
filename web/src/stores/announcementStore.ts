import { create } from 'zustand';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';
import { Announcement } from '../typings';

const DEBUG_ANNOUNCEMENTS: Announcement[] = [
  {
    contents: 'Dsadaasd Hello there buddy, this is a message from the server.',
    id: 1,
    playerId: 1,
    position: [0, 0, 0],
    callsign: 132,
    firstname: 'Fdsadas',
    lastname: 'DSasd',
    citizenid: 'dsadas',
    image: 'https://cdn.vectorstock.com/i/preview-1x/97/68/account-avatar-dark-mode-glyph-ui-icon-vector-44429768.jpg',
    createdAt: Date.now() - 300000, // 5 minutes ago
  },
  {
    contents: 'Dsadaasd Hello there buddy, this is a message from the server.',
    id: 2,
    playerId: 1,
    position: [0, 0, 0],
    callsign: 132,
    firstname: 'Fdsadas',
    lastname: 'DSasd',
    citizenid: 'dsadas',
    image: 'https://cdn.vectorstock.com/i/preview-1x/97/68/account-avatar-dark-mode-glyph-ui-icon-vector-44429768.jpg',
    createdAt: Date.now() - 900000, // 10 minutes ago
  },
  {
    contents: 'Dsadaasd Hello there buddy, this is a message from the server.',
    id: 3,
    playerId: 1,
    position: [0, 0, 0],
    callsign: 132,
    firstname: 'Fdsadas',
    lastname: 'DSasd',
    citizenid: 'dsadas',
    image: 'https://cdn.vectorstock.com/i/preview-1x/97/68/account-avatar-dark-mode-glyph-ui-icon-vector-44429768.jpg',
    createdAt: Date.now() - 1200000000000000000000, // 20 minutes ago
  },
  {
    contents: 'Dsadaasd Hello there buddy',
    id: 4,
    playerId: 1,
    position: [0, 0, 0],
    callsign: 132,
    firstname: 'fad',
    lastname: 'DSasd',
    citizenid: 'dsadas',
    image: 'https://cdn.vectorstock.com/i/preview-1x/97/68/account-avatar-dark-mode-glyph-ui-icon-vector-44429768.jpg',
    createdAt: Date.now(),
  },
  {
    contents: 'Dsadaasd Hello there buddy',
    id: 5,
    playerId: 1,
    position: [0, 0, 0],
    callsign: 132,
    firstname: 'fad',
    lastname: 'DSasd',
    citizenid: 'dsadas',
    image: 'https://cdn.vectorstock.com/i/preview-1x/97/68/account-avatar-dark-mode-glyph-ui-icon-vector-44429768.jpg',
    createdAt: Date.now(),
  },
];

type AnnouncementDataState = {
  announcements: Announcement[];
  fetchAnnouncements: () => Promise<void>;
};

const useAnnouncementStore = create<AnnouncementDataState>((set) => ({
  announcements: [],

  fetchAnnouncements: async () => {
    if (isEnvBrowser()) {
      set({ announcements: [...DEBUG_ANNOUNCEMENTS] });
    } else {
      const response = await fetchNui('getAnnouncements');
      set({ announcements: [...response.announcements] });
    }
  }
}));

export default useAnnouncementStore;