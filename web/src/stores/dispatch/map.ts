import {create} from 'zustand';
import L from 'leaflet';

interface MapStore {
  dispatchMap: L.Map | null;
  setDispatchMap: (map: L.Map | null) => void;
}

const useMapStore = create<MapStore>((set) => ({
  dispatchMap: null,
  setDispatchMap: (map) => set({ dispatchMap: map }),
}));

export const useDispatchMap = () => useMapStore((state) => state.dispatchMap);
export const useSetDispatchMap = () => useMapStore((state) => state.setDispatchMap);

