import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { BaseComponent } from "../components/BaseComponent";

type Tab = {
    id: string;
    label: string;
    component: React.ReactNode;
};

type TabStore = {
    tabs: Tab[];
    activeTabId: string | null;
    addTab: (tab: Tab) => void;
    removeTab: (id: string) => void;
    setActiveTab: (id: string) => void;
    ensureDefaultTab: () => void;
    updateTabLabel: (id: string, label: string) => void;
};

export const useTabStore = create<TabStore>((set, get) => ({
    tabs: [],
    activeTabId: null,

    addTab: (tab) => {
        set((state) => ({
            tabs: [...state.tabs, tab],
            activeTabId: tab.id,
        }));
    },

    removeTab: (id) => {
        const { tabs, activeTabId } = get();
        if (tabs.length <= 1) return; // Prevent removing the last tab

        const newTabs = tabs.filter((t) => t.id !== id);
        const newActiveTab =
            activeTabId === id
                ? newTabs[newTabs.length - 1]?.id ?? null
                : activeTabId;

        set({ tabs: newTabs, activeTabId: newActiveTab }, false);
    },

    setActiveTab: (id) => set({ activeTabId: id }),

    ensureDefaultTab: () => {
        const { tabs, addTab } = get();
        if (tabs.length === 0) {
            const id = uuidv4();
            addTab({
                id,
                label: "Dashboard",
                component: <BaseComponent initialPath="/" tabId={id} />,
            });
        }
    },

    updateTabLabel: (id, label) =>
        set((state) => ({
            tabs: state.tabs.map((t) => (t.id === id ? { ...t, label } : t)),
        })),
}));
