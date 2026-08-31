import { create } from "zustand";

interface LocaleState {
    locale: string;
    strings: Record<string, string>;
    initialize: (locale: string, strings: Record<string, string>) => void;
}
export const useLocaleStore = create<LocaleState>((set) => ({
    locale: "en",
    strings: {},
    initialize: (locale, strings) => set({ locale, strings }),
}));
