import { v4 as uuidv4 } from "uuid";
import { useTabStore } from "../stores/tabStore.tsx";
import { BaseComponent } from "./BaseComponent";
import { IconPlus, IconX } from "@tabler/icons-react";

export const Tabs = () => {
    const { tabs, activeTabId, removeTab, setActiveTab, addTab } =
        useTabStore();

    const handleAdd = () => {
        const id = uuidv4();
        addTab({
            id,
            label: "Dashboard",
            component: <BaseComponent tabId={id} />,
        });
    };

    return (
        <div className="flex gap-2 pt-2 px-4 border-b border-gray-700">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    className={`flex flex-row gap-2 px-2 border-t border-l border-r border-gray-700 rounded-t-lg ${
                        tab.id === activeTabId
                            ? "bg-gray-800 text-blue-400"
                            : "text-gray-400 hover:text-white"
                    }`}
                >
                    <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`text-sm font-medium transition rounded-t-md`}
                    >
                        {tab.label}
                    </button>
                    <div className="flex items-center">
                        <div
                            className="cursor-pointer hover:bg-slate-600 hover:rounded-md"
                            onClick={() => removeTab(tab.id)}
                        >
                            <IconX color="white" size={18} />
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={handleAdd}
                className="p-2 text-sm border-t border-l border-r border-gray-700 rounded-t-lg"
            >
                <IconPlus color="white" size={18} />
            </button>
        </div>
    );
};
