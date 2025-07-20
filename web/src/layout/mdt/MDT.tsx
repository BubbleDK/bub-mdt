import { useEffect } from "react";
import { Tabs } from "../../components/Tabs";
import { useTabStore } from "../../stores/tabStore.tsx";

function MDT() {
    const { tabs, activeTabId, ensureDefaultTab } = useTabStore();

    useEffect(() => {
        ensureDefaultTab(); // ✅ open a default tab if none exists
    }, []);

    return (
        <div className="w-[1750px] h-[970px] rounded-lg bg-gray-900 shadow-lg flex flex-col">
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
