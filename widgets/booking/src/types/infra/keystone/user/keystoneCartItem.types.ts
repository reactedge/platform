// user/keystoneCartItem.types.ts
import type {KeystoneEvent} from "../event/keystoneEvent.types.ts";

export interface KeystoneCartItem {
    id: string;
    quantity: number;
    price: number;
    shampoo: boolean;
    event: KeystoneEvent;
    eventType: {
        name: string;
    };
}
