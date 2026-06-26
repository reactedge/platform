// domain/mapKeystoneUser.ts
import type {KeystoneAuthenticatedUser} from "../../../types/infra/keystone";
import type {AuthenticatedUser} from "../../../types/domain/user.type.ts";

/**
 * Maps a Keystone user into the widget’s domain user.
 * Currently a structural pass-through, but acts as a boundary
 * to prevent Keystone schema leakage.
 */

export function mapKeystoneUser(
    keystoneUser: KeystoneAuthenticatedUser
): AuthenticatedUser {
    return {
        id: keystoneUser.id,
        email: keystoneUser.email,
        name: keystoneUser.name,

        eventHost: keystoneUser.eventHost ?? null,
        eventType: keystoneUser.eventType ?? null,
        eventTypeGroup: keystoneUser.eventTypeGroup ?? null,

        weekPreference: keystoneUser.weekPreference ?? null,

        cartItems: keystoneUser.cartItems ?? [],

        role: {
            isEventHost: keystoneUser.role?.isEventHost ?? false,
        },
    };
}