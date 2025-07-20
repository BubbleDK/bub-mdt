import {
    MemoryRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import { Sidebar } from "./Sidebar";
import Dashboard from "../layout/mdt/pages/dashboard/Dashboard";
import Charges from "../layout/mdt/pages/charges/Charges";
import Dispatch from "../layout/mdt/pages/dispatch/Dispatch";
import Incidents from "../layout/mdt/pages/incidents/Incidents";
import Profiles from "../layout/mdt/pages/profiles/Profiles";
import Reports from "../layout/mdt/pages/reports/Reports";
import Vehicles from "../layout/mdt/pages/vehicles/Vehicles";
import Roster from "../layout/mdt/pages/roster/Roster";
import { useTabStore } from "../stores/tabStore.tsx";
import { useEffect } from "react";

const routeLabelMap: Record<string, string> = {
    "/": "Dashboard",
    "/profiles": "Profiles",
    "/incidents": "Incidents",
    "/reports": "Reports",
    "/vehicles": "Vehicles",
    "/dispatch": "Dispatch",
    "/roster": "Roster",
    "/charges": "Charges",
};

type BaseComponentProps = {
    tabId: string;
    initialPath?: string;
};

export const BaseComponent = ({
    tabId,
    initialPath = "/",
}: BaseComponentProps) => {
    return (
        <MemoryRouter initialEntries={[initialPath]}>
            <InnerRouter tabId={tabId} />
        </MemoryRouter>
    );
};

const InnerRouter = ({ tabId }: { tabId: string }) => {
    const location = useLocation();
    const { updateTabLabel } = useTabStore();

    useEffect(() => {
        const path = location.pathname;
        const label = routeLabelMap[path] ?? "MDT";
        updateTabLabel(tabId, label);
    }, [location.pathname]);

    return (
        <div className="flex w-full h-full overflow-hidden">
            <Sidebar />
            <div className="flex-1 p-4 overflow-auto bg-gray-900 text-white">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profiles" element={<Profiles />} />
                    <Route path="/incidents" element={<Incidents />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/vehicles" element={<Vehicles />} />
                    <Route path="/dispatch" element={<Dispatch />} />
                    <Route path="/roster" element={<Roster />} />
                    <Route path="/charges" element={<Charges />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
};
