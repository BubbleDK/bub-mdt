import { lazy, Suspense, useEffect, useState } from "react";
import { TabBar } from "../../tabs/ui/TabBar";
import { createTabWindow } from "../../tabs/lib/createTabWindow";
import { useTabStore } from "../../tabs/model/useTabStore";
import { MdtHeader } from "./MdtHeader";
const CommandPalette = lazy(() =>
    import("./CommandPalette").then((module) => ({ default: module.CommandPalette }))
);
import useAppVisibilityStore from "../../../stores/appVisibilityStore";
import { fetchNui } from "../../../utils/fetchNui";

export default function MdtShell() {
    const tabs = useTabStore((state) => state.tabs);
    const activeTabId = useTabStore((state) => state.activeTabId);
    const ensureDefaultTab = useTabStore((state) => state.ensureDefaultTab);
    const [isPaletteOpen, setPaletteOpen] = useState(false);

    useEffect(() => {
        ensureDefaultTab(createTabWindow);
    }, [ensureDefaultTab]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!useAppVisibilityStore.getState().showApp) return;
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                if (!isPaletteOpen && document.querySelector('[role="dialog"]')) return;
                e.preventDefault();
                setPaletteOpen((open) => !open);
            }

            if (e.key === "Escape") {
                if (isPaletteOpen) {
                    setPaletteOpen(false);
                    return;
                }
                if (document.querySelector('[role="dialog"]')) return;
                if (!isPaletteOpen && useAppVisibilityStore.getState().showApp) {
                    void fetchNui("exit", undefined, { data: true })
                        .then(() => useAppVisibilityStore.getState().hide())
                        .catch(console.error);
                }
                setPaletteOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isPaletteOpen]);

    return (
        <div className="mdt-shell rounded-lg bg-brand-dark shadow-lg flex flex-col relative">
            {isPaletteOpen && (
                <Suspense
                    fallback={
                        <p role="status" className="absolute z-50 bg-brand-dark p-4 text-white">
                            Loading navigation…
                        </p>
                    }
                >
                    <CommandPalette open={isPaletteOpen} setOpen={setPaletteOpen} />
                </Suspense>
            )}

            <MdtHeader setOpen={setPaletteOpen} />
            <TabBar />

            <div className="flex-1 min-h-0 relative">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        inert={tab.id !== activeTabId}
                        className={`absolute inset-0 transition-opacity duration-200 ${
                            tab.id === activeTabId
                                ? "opacity-100 z-10"
                                : "opacity-0 pointer-events-none z-0"
                        }`}
                    >
                        {tab.component}
                    </div>
                ))}
            </div>
        </div>
    );
}
