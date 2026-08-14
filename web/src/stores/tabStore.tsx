import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { BaseComponent } from "../components/BaseComponent";
import { House, type LucideProps } from "lucide-react";

export type Tab = {
    id: string;
    label: string;
    icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
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
    updateTabIcon: (
        id: string,
        icon: React.ForwardRefExoticComponent<
            Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
        >
    ) => void;
    updateTabMeta: (id: string, label: string, icon: Tab["icon"]) => void;
    moveTab: (fromIndex: number, toIndex: number) => void;
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
                label: "Home",
                icon: House,
                component: <BaseComponent initialPath="/" tabId={id} />,
            });
        }
    },

    updateTabLabel: (id, label) =>
        set((state) => ({
            tabs: state.tabs.map((t) => (t.id === id ? { ...t, label } : t)),
        })),

    updateTabIcon: (id, icon) =>
        set((state) => ({
            tabs: state.tabs.map((t) => (t.id === id ? { ...t, icon } : t)),
        })),

    updateTabMeta: (id, label, icon) =>
        set((state) => {
            const index = state.tabs.findIndex((tab) => tab.id === id);
            const current = state.tabs[index];
            if (!current || (current.label === label && current.icon === icon)) {
                return state;
            }

            const tabs = state.tabs.slice();
            tabs[index] = { ...current, label, icon };
            return { tabs };
        }),

    moveTab: (fromIndex: number, toIndex: number) =>
        set((state) => {
            const updatedTabs = [...state.tabs];
            const [moved] = updatedTabs.splice(fromIndex, 1);
            updatedTabs.splice(toIndex, 0, moved);
            return { tabs: updatedTabs };
        }),
}));
