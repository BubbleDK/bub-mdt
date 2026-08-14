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
import {
    House,
    User,
    ScrollText,
    FolderClosed,
    CarFront,
    Radio,
    Users,
    Scale,
    type LucideProps,
} from "lucide-react";

const routeLabelMap: Record<string, string> = {
    "/": "Home",
    "/profiles": "Profiles",
    "/incidents": "Incidents",
    "/reports": "Reports",
    "/vehicles": "Vehicles",
    "/dispatch": "Dispatch",
    "/roster": "Roster",
    "/charges": "Charges",
};

const routeIconMap: Record<
    string,
    React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >
> = {
    "/": House,
    "/profiles": User,
    "/incidents": ScrollText,
    "/reports": FolderClosed,
    "/vehicles": CarFront,
    "/dispatch": Radio,
    "/roster": Users,
    "/charges": Scale,
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
    const updateTabMeta = useTabStore((state) => state.updateTabMeta);

    useEffect(() => {
        const path = location.pathname;

        const label = routeLabelMap[path] ?? "MDT";
        const icon = routeIconMap[path] ?? House;
        updateTabMeta(tabId, label, icon);
    }, [location.pathname, tabId, updateTabMeta]);

    return (
        <div className="flex w-full h-full rounded-b-lg relative">
            <Sidebar />
            <div className="flex-1 p-2 text-white relative h-full w-full">
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
