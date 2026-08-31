import MdtShell from "./features/mdt/ui/MdtShell";
import useAppVisibilityStore from "./stores/appVisibilityStore";
import { useRuntimeEvents } from "./features/mdt/model/useRuntimeEvents";
import { DispatchOverlay } from "./features/dispatch/ui/DispatchOverlay";
import "./features/mdt/ui/workspace.css";
import { useEffect, useState } from "react";
import { ConfirmationProvider } from "./features/mdt/ui/ConfirmationProvider";

function App() {
    useRuntimeEvents();
    const visible = useAppVisibilityStore((state) => state.showApp);
    const [hasOpened, setHasOpened] = useState(visible);
    useEffect(() => {
        if (visible) setHasOpened(true);
    }, [visible]);

    return (
        <ConfirmationProvider>
            <div
                className="h-full w-full items-center justify-center"
                style={{ display: visible ? "flex" : "none" }}
            >
                {(visible || hasOpened) && <MdtShell />}
            </div>
            <DispatchOverlay />
        </ConfirmationProvider>
    );
}

export default App;
