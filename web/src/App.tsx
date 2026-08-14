import { useNuiEvent } from "./hooks/useNuiEvent";
import MdtShell from "./features/mdt/ui/MdtShell";
import useConfigStore from "./stores/configStore";
import type { Config } from "./typings";

function App() {
    const setConfig = useConfigStore((state) => state.setConfig);

    useNuiEvent("setConfig", (data: { config: Config }) => {
        setConfig(data.config);
    });

    return (
        <div className="flex h-full w-full items-center justify-center">
            <MdtShell />
        </div>
    );
}

export default App;
