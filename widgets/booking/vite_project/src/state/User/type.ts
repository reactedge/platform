import type {AuthenticatedUser} from "../../types/domain/user.type.ts";

export interface UserInfoState {
    user?: AuthenticatedUser;
    loading: boolean;
    error?: Error | null;
}

export interface UserState {
    user?: AuthenticatedUser;
    loading: boolean;
    error?: Error | null;
    refreshUser: () => Promise<void>;
    config: UserConfig
}

export interface UserConfig {
    auth: string;
}