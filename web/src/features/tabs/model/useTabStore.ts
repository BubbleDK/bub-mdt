import { create } from "zustand";
import type { LucideIcon } from "lucide-react";
import type { TabWindow } from "./tabTypes";

interface TabState {
    tabs: TabWindow[];
    activeTabId: string | null;
    addTab: (tab: TabWindow) => void;
    removeTab: (id: string) => void;
    setActiveTab: (id: string) => void;
    ensureDefaultTab: (createTab: () => TabWindow) => void;
    updateTabLabel: (id: string, label: string) => void;
    updateTabIcon: (id: string, icon: LucideIcon) => void;
    updateTabMeta: (id: string, label: string, icon: LucideIcon) => void;
    moveTab: (fromIndex: number, toIndex: number) => void;
}

export const useTabStore = create<TabState>((set, get) => ({
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
        if (tabs.length <= 1) return;

        const remainingTabs = tabs.filter((tab) => tab.id !== id);
        set({
            tabs: remainingTabs,
            activeTabId:
                activeTabId === id
                    ? remainingTabs[remainingTabs.length - 1]?.id ?? null
                    : activeTabId,
        });
    },

    setActiveTab: (id) => set({ activeTabId: id }),

    ensureDefaultTab: (createTab) => {
        if (get().tabs.length === 0) {
            get().addTab(createTab());
        }
    },

    updateTabLabel: (id, label) =>
        set((state) => ({
            tabs: state.tabs.map((tab) =>
                tab.id === id ? { ...tab, label } : tab
            ),
        })),

    updateTabIcon: (id, icon) =>
        set((state) => ({
            tabs: state.tabs.map((tab) =>
                tab.id === id ? { ...tab, icon } : tab
            ),
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

    moveTab: (fromIndex, toIndex) =>
        set((state) => {
            const tabs = [...state.tabs];
            const [moved] = tabs.splice(fromIndex, 1);
            tabs.splice(toIndex, 0, moved);
            return { tabs };
        }),
}));
