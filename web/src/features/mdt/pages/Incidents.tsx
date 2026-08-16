import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { IncidentDetailPage } from "../../incidents/ui/IncidentDetailPage";
import { CreateIncidentPage } from "../../incidents/ui/CreateIncidentPage";
import { IncidentSearchPage } from "../../incidents/ui/IncidentSearchPage";

export default function Incidents() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
                <Route index element={<IncidentSearchPage />} />
                <Route path="new" element={<CreateIncidentPage />} />
                <Route path=":incidentId" element={<IncidentDetailPage />} />
            </Routes>
        </AnimatePresence>
    );
}
