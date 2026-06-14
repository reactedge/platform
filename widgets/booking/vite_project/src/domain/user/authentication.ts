import type {AuthenticatedUser} from "../../types/domain/user.type.ts";
import {activity} from "../../activity";
import type {UserConfig} from "../../state/User/type.ts";

export async function fetchUserFromBridge(config: UserConfig): Promise<AuthenticatedUser | undefined> {
    const res = await fetch(`${config.auth}/auth/refresh-session`, {
        method: 'POST',
        credentials: 'include',
    });

    activity('session-read', 'Session Read', res);

    // Real failure
    if (!res.ok) {
        return undefined;
    }

    const json = await res.json();
    return json.user ?? undefined;
}

// auth.api.ts
export async function loginWithCredentials(email: string, password: string, config: UserConfig) {
    const res = await fetch(`${config.auth}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    activity('login', 'Login', res);

    if (!res.ok) {
        throw new Error('Login failed');
    }
}

export async function logout(config: UserConfig) {
    const res = await fetch(`${config.auth}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    });

    activity('logout', 'Logout', res);

    if (!res.ok) {
        throw new Error('Logout failed');
    }
}

export async function loginWithGoogle(config: UserConfig) {
    const returnTo = encodeURIComponent(window.location.href);

    activity('login', 'Google Login');
    window.location.href = `${config.auth}/auth/google?returnTo=${returnTo}`;
}

export async function verifyUser(config: UserConfig, token: string) {
    const res = await fetch(`${config.auth}/security/verify-human`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
    });

    activity('verifyUser', 'Verify User', res);

    if (!res.ok) {
        throw new Error('Logout failed');
    }
}