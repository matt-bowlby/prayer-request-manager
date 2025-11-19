import { create } from "zustand";

interface PrayerStore {
    prayers: Prayer[];
    addPrayer: (prayer: Prayer) => void;
    removePrayer: (id: string) => void;
    editPrayer: (id: string, updatedPrayer: Partial<Prayer>) => void;
    randomizePrayerList: () => void;
    getLastSeenPrayerIndex: () => number;
    setSeen: (id: string) => void;
}

export const usePrayerStore = create<PrayerStore>((set, get) => ({
    prayers: [],
    addPrayer: (prayer: Prayer) => {
        set((state) => {
            // Add new prayer to start of prayer list
            state.prayers.unshift(prayer);
            return { prayers: state.prayers };
        });
    },
    removePrayer: (id: string) => {
        set((state) => {
            state.prayers = state.prayers.filter((prayer) => prayer.id !== id);
            return { prayers: state.prayers };
        });
    },
    editPrayer: (id: string, updatedPrayer: Partial<Prayer>) => {
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
    setSeen: (id: string) => {
        set((state) => {
            state.prayers = state.prayers.map((prayer) =>
                prayer.id === id ? { ...prayer, seen: true } : prayer
            );
            return { prayers: state.prayers };
        });
    }
}));
