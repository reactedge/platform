import {type ReactNode, useEffect} from "react";
import {LocalUserStateContext} from "./UserState.tsx";
import {useImmer} from "use-immer";
import type {UserConfig, UserInfoState} from "./type.ts";
import type {AuthenticatedUser} from "../../types/domain/user.type.ts";
import {fetchUserFromBridge} from "../../domain/user/authentication.ts";

const LocalStateProvider = LocalUserStateContext.Provider;

interface UserStateProviderProps {
    children: ReactNode;
    config: UserConfig
}

const intialState: UserInfoState = {
    user: undefined,
    loading: false,
    error: null
}

export const UserStateProvider: React.FC<UserStateProviderProps> = ({ children, config}) => {
    const [state, setState] = useImmer<UserInfoState>(intialState);

    const startLoading = (draft: UserInfoState) => {
        draft.loading = true;
        draft.error = null;
    };

    const setSuccess = (draft: UserInfoState, user: AuthenticatedUser | undefined) => {
        draft.user = user;
        draft.loading = false;
    };

    const setFailure = (draft: UserInfoState, err: Error) => {
        draft.user = undefined;
        draft.loading = false;
        draft.error = err;
    };

    const refresh = async () => {
        try {
            setState(startLoading);

            const user = await fetchUserFromBridge(config);

            setState(draft => setSuccess(draft, user));
        } catch (err) {
            setState(draft => setFailure(draft, err as Error));
        }
    };

    useEffect(() => {
        if (!config?.auth) return;

        let alive = true;

        const safeRefresh = async () => {
            try {
                setState(startLoading);

                const user = await fetchUserFromBridge(config);
                if (!alive) return;

                setState(draft => setSuccess(draft, user));
            } catch (err) {
                if (!alive) return;

                setState(draft => setFailure(draft, err as Error));
            }
        };

        safeRefresh();

        return () => {
            alive = false;
        };
    }, []);

    return (
        <LocalStateProvider
            value={{
                user: state.user,
                loading: state.loading,
                error: state.error,
                config,
                refreshUser: refresh,
            }}
        >
            {children}
        </LocalStateProvider>
    );
};

