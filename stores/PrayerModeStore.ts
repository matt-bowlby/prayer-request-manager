import { create } from "zustand";

interface PrayerMode {
    mode: "Personal" | "Social";
    setPrayerMode: (mode: "Personal" | "Social") => void;
}

export const usePrayerModeStore = create<PrayerMode>((set) => ({
    mode: "Personal",
    setPrayerMode: (mode: "Personal" | "Social") =>
        set(() => ({
            mode: mode,
        }))
}));
