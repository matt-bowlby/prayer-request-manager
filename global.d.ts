interface Prayer {
    id: string;
    title: string;
    description: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    seen: boolean;
    deleted: boolean;
}
