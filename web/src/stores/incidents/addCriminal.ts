import { create } from "zustand";
import { fetchNui } from "../../utils/fetchNui";
import type { CriminalProfile } from "../../typings";
import { isEnvBrowser } from "../../utils/misc";

interface CriminalProfileStoreState {
    criminalProfiles: CriminalProfile[];
    getCriminalProfiles: (value: string) => void;
    setCriminalProfiles: (criminalProfiles: CriminalProfile[]) => void;
}

const DEBUG_CRIMINALPROFILES: CriminalProfile[] = [
    { firstname: "John", lastname: "Doe", dob: Date.now(), citizenid: "12345" },
    {
        firstname: "Jane",
        lastname: "Smith",
        dob: Date.now(),
        citizenid: "67890",
    },
    {
        firstname: "David",
        lastname: "Williams",
        dob: Date.now(),
        citizenid: "13579",
    },
    {
        firstname: "Samantha",
        lastname: "Jones",
        dob: Date.now(),
        citizenid: "24680",
    },
];

const useCriminalProfileStore = create<CriminalProfileStoreState>((set) => ({
    criminalProfiles: isEnvBrowser() ? DEBUG_CRIMINALPROFILES : [],
    getCriminalProfiles: async (value: string) => {
        if (value === "") return set({ criminalProfiles: [] });

        const criminalProfiles = await fetchNui("getCriminalProfiles", value, {
            data: DEBUG_CRIMINALPROFILES,
            delay: 300,
        });
        set({ criminalProfiles });
    },
    setCriminalProfiles: (criminalProfiles) => set({ criminalProfiles }),
}));

export default useCriminalProfileStore;
