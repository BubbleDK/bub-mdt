import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { ProfileDetailPage } from "./ProfileDetailPage";
import { ProfileSearchPage } from "./ProfileSearchPage";

export default function Profiles() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
                <Route index element={<ProfileSearchPage />} />
                <Route path=":citizenId" element={<ProfileDetailPage />} />
            </Routes>
        </AnimatePresence>
    );
}
