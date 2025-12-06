type PrayerType = "pray" | "ask" | "praise" | "thank" | "confess" | "lament";

interface Prayer {
    id: number;
    type: PrayerType;
    recipient: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    seen: boolean;
    deleted: boolean;
}

interface Settings {
    name: string;
}

interface AppData {
    onboardingComplete: boolean;
}