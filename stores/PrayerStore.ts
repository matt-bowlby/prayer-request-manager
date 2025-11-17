import { create } from "zustand";

interface PrayerStore {
    prayers: Map<string, Prayer>;
    unseen: string[];
    addPrayer: (prayer: Prayer) => void;
    removePrayer: (id: string) => void;
    getRandomPrayer: () => Prayer | undefined;
}

export const usePrayerStore = create<PrayerStore>((set, get) => ({
    prayers: new Map<string, Prayer>(),
    unseen: [],
    addPrayer: (prayer: Prayer) => {
        set((state) => {
            state.prayers.set(prayer.id, prayer);
            state.unseen.push(prayer.id);
            return { prayers: state.prayers, unseen: state.unseen };
        });
    },
    removePrayer: (id: string) => {
        set((state) => {
            state.prayers.delete(id);
            state.unseen = state.unseen.filter((prayerId) => prayerId !== id);
            return { prayers: state.prayers, unseen: state.unseen };
        });
    },
    getRandomPrayer: () => {
        if (get().prayers.size === 0) return undefined;
        if (get().unseen.length === 0) {
            // Reset unseen prayers
            set(() => ({ unseen: Array.from(get().prayers.keys()) }));
        }
        const randomIndex = Math.floor(Math.random() * get().unseen.length);
        const randomId = get().unseen[randomIndex];
        set((state) => {
            const newUnseen = [...state.unseen];
            newUnseen.splice(randomIndex, 1);
            return { unseen: newUnseen };
        });
        return get().prayers.get(randomId);
    },
}));
