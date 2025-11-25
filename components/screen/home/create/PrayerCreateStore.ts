import { create } from "zustand";

interface PrayerCreateStore {
    recipient: string;
    setRecipient: (recipient: string) => void;
    type: PrayerType;
    setType: (type: PrayerType) => void;
    body: string;
    setBody: (body: string) => void;
    reset: () => void;
}

export const usePrayerCreateStore = create<PrayerCreateStore>((set) => ({
    recipient: "",
    setRecipient: (recipient: string) => set({ recipient }),
    type: "pray",
    setType: (type: PrayerType) => set({ type }),
    body: "",
    setBody: (body: string) => set({ body }),
    reset: () => set({ recipient: "", type: "pray", body: "" }),
}));

