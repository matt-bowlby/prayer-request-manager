import {create} from "zustand";

interface HomeStore {
	homeMode: "Settings" | "Prayer" | "Create";
	setHomeMode: (mode: "Settings" | "Prayer" | "Create") => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
	homeMode: "Prayer",
	setHomeMode: (mode) => set({ homeMode: mode }),
}));