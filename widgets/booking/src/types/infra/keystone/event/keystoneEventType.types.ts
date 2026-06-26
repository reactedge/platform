// keystoneEventType.types.ts
export interface KeystoneEventType {
    id: string;
    name: string;
    description?: string | null;
    duration: number
}

// keystoneEventTypeGroup.types.ts
export interface KeystoneEventTypeGroup {
    id: string;
    name: string;
    description?: string | null;
}
