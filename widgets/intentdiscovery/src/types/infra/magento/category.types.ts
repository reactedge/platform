export interface CategoryData {
    id: number;
    name: string;
    description?: string | null;
    image?: string | null;
    children: MagentoCategoryChild[];
}

export interface MagentoCategoryChild {
    id: number;
}