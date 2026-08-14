import {
    MemoryRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import Dashboard from "../../dashboard/ui/Dashboard";
import Charges from "../../mdt/pages/Charges";
import Dispatch from "../../mdt/pages/Dispatch";
import Incidents from "../../mdt/pages/Incidents";
import Profiles from "../../mdt/pages/Profiles";
import Reports from "../../mdt/pages/Reports";
import Vehicles from "../../mdt/pages/Vehicles";
import Roster from "../../mdt/pages/Roster";
import { useTabStore } from "../model/useTabStore";
import { useEffect } from "react";
import { getMdtNavigationItem } from "../config/mdtNavigation";
import { TabSidebar } from "./TabSidebar";

interface TabContentProps {
    tabId: string;
    initialPath?: string;
};

export function TabContent({
    tabId,
    initialPath = "/",
}: TabContentProps) {
    return (
        <MemoryRouter initialEntries={[initialPath]}>
            <InnerRouter tabId={tabId} />
        </MemoryRouter>
    );
}

const InnerRouter = ({ tabId }: { tabId: string }) => {
    const location = useLocation();
    const updateTabMeta = useTabStore((state) => state.updateTabMeta);

    useEffect(() => {
        const { label, icon } = getMdtNavigationItem(location.pathname);
        updateTabMeta(tabId, label, icon);
    }, [location.pathname, tabId, updateTabMeta]);

    return (
        <div className="flex w-full h-full rounded-b-lg relative">
            <TabSidebar />
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
