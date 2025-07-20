import { create } from 'zustand';
import { Config } from '../typings';

// Define the state shape and associated actions
interface configStoreInterface {
    config: Config;
    setConfig: (config: Config) => void;
}

const useConfigStore = create<configStoreInterface>((set) => ({
    config: { 
        isDispatchEnabled: true 
    },

    setConfig: (config: Config) => set({ config: config })
}));

export default useConfigStore;