import { useNuiEvent } from "./hooks/useNuiEvent";
import MDT from "./layout/mdt/MDT";
import useConfigStore from "./stores/configStore";
import type { Config } from "./typings";

function App() {
    const { setConfig } = useConfigStore();

    useNuiEvent("setConfig", (data: { config: Config }) => {
        setConfig(data.config);
    });

    return (
        <div className="flex h-full w-full items-center justify-center">
            <MDT />
        </div>
    );
}

export default App;
