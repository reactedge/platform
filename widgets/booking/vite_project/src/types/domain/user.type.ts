import type {KeystoneAuthenticatedUser} from "../infra/keystone";

export type AuthenticatedUser = KeystoneAuthenticatedUser;

export interface EventHostRef {
    id: string;
    name: string;
}

export interface EventTypeRef {
    id: string;
    name: string;
}

export interface EventTypeGroupRef {
    id: string;
    name: string;
}

export interface UserCartItem {
    id: string;
    quantity: number;
    price: number;
    shampoo: boolean;

    eventType: {
        name: string;
    };

    event: {
        id: string;
        day: string;
        startTime: string;
        endTime: string;
        eventHost: EventHostRef;
    };
}

export interface UserRole {
    isEventHost: boolean;
}
