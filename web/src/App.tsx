import { useNuiEvent } from "./hooks/useNuiEvent";
import MdtShell from "./features/mdt/ui/MdtShell";
import useConfigStore from "./stores/configStore";
import useProfilesStore from "./stores/profilesStore";
import type { Config, CustomProfileData } from "./typings";

function App() {
    const setConfig = useConfigStore((state) => state.setConfig);
    const setProfileCards = useProfilesStore((state) => state.setProfileCards);

    useNuiEvent("setConfig", (data: { config: Config }) => {
        setConfig(data.config);
    });

    useNuiEvent("setInitData", (data: { profileCards: CustomProfileData[] }) => {
        setProfileCards(data.profileCards);
    });

    return (
        <div className="flex h-full w-full items-center justify-center">
            <MdtShell />
        </div>
    );
}

export default App;
