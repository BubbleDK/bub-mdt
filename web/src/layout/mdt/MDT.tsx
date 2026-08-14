import { useEffect, useState } from "react";
import { Tabs } from "../../components/Tabs";
import { useTabStore } from "../../stores/tabStore.tsx";
import { Header } from "../../components/Header.tsx";
import CommandPalette from "../../components/CommandPalette.tsx";

function MDT() {
    const tabs = useTabStore((state) => state.tabs);
    const activeTabId = useTabStore((state) => state.activeTabId);
    const ensureDefaultTab = useTabStore((state) => state.ensureDefaultTab);
    const [isPaletteOpen, setPaletteOpen] = useState(false);

    useEffect(() => {
        ensureDefaultTab();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setPaletteOpen((open) => !open);
            }

            if (e.key === "Escape") {
                setPaletteOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="w-[1770px] h-[980px] rounded-lg bg-brand-dark shadow-lg flex flex-col relative">
            <CommandPalette open={isPaletteOpen} setOpen={setPaletteOpen} />

            <Header setOpen={setPaletteOpen} />
            <Tabs />

            <div className="flex-1 relative">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
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

export default MDT;
