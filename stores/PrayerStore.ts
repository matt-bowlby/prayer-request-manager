import { create } from "zustand";
import { getPrayers, addPrayer, editPrayer } from "../storage/database";

interface PrayerStore {
    prayers: Prayer[];
    getPrayers: () => Promise<void>;
    addPrayer: (prayer: Prayer) => void;
    removePrayer: (id: number) => void;
    editPrayer: (id: number, updatedPrayer: Partial<Prayer>) => void;
    randomizePrayerList: () => void;
    getLastSeenPrayerIndex: () => number;
    setSeen: (id: number) => void;
}

export const usePrayerStore = create<PrayerStore>((set, get) => ({
    prayers: [],
    async getPrayers(): Promise<void> {
        let prayers = await getPrayers().catch((err) => {
            console.error("Failed to fetch prayers from database:", err);
            return [];
        });
        set((_) => {
            return { prayers: prayers };
         });
    },
    addPrayer: (prayer: Prayer) => {
        set((state) => {
            // Add new prayer to start of prayer list
            prayer.id = state.prayers.length;
            state.prayers.unshift(prayer);
            return { prayers: state.prayers };
        });
        // Also add to database
        addPrayer(prayer).catch((err) => {
            console.error("Failed to add prayer to database:", err);
        });
    },
    removePrayer: (id: number) => {
        set((state) => {
            state.prayers = state.prayers.filter((prayer) => prayer.id !== id);
            return { prayers: state.prayers };
        });
        editPrayer(Number(id), { deleted: true }).catch((err) => {
            console.error("Failed to mark prayer as deleted in database:", err);
        });
    },
    editPrayer: (id: number, updatedPrayer: Partial<Prayer>) => {
        set((state) => {
            const existingPrayer = state.prayers.find((prayer) => prayer.id === id);
            if (existingPrayer) {
                const newPrayer = { ...existingPrayer, ...updatedPrayer };
                state.prayers = state.prayers.map((prayer) =>
                    prayer.id === id ? newPrayer : prayer
                );
            }
            return { prayers: state.prayers };
        });
        editPrayer(id, updatedPrayer).catch((err) => {
            console.error("Failed to edit prayer in database:", err);
        });
    },
    randomizePrayerList: () => {
        set((state) => {
            const shuffled = [...state.prayers];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return { prayers: shuffled };
        });
        // Reset all prayers to unseen
        set((state) => {
            state.prayers = state.prayers.map((prayer) => ({ ...prayer, seen: false }));
            return { prayers: state.prayers };
        });
    },
    getLastSeenPrayerIndex: () => {
        const prayers = get().prayers;
        for (let i = prayers.length - 1; i >= 0; i--) {
            if (prayers[i].seen) {
                return i;
            }
        }
        return -1; // No prayers have been seen
    },
    setSeen: (id: number) => {
        set((state) => {
            state.prayers = state.prayers.map((prayer) =>
                prayer.id === id ? { ...prayer, seen: true } : prayer
            );
            return { prayers: state.prayers };
        });
    },
}));
