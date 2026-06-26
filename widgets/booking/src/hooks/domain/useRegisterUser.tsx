import { useCallback, useState } from 'react';
import { useKeystoneCheckUser } from '../infra/useKeystoneCheckUser';
import { useKeystoneRegisterUser } from '../infra/useKeystoneRegisterUser';
import {registerSchema} from "../../domain/user/schemas/registerSchema.ts";

export type RegisterResult =
    | { ok: true }
    | { ok: false; error: string };

export const useRegisterUser = () => {
    const { checkUserByEmail } = useKeystoneCheckUser();
    const { registerUser } = useKeystoneRegisterUser();

    const [loading, setLoading] = useState(false);

    const register = useCallback(
        async (
            name: string,
            email: string,
            password: string,
            confirmPassword: string
        ): Promise<RegisterResult> => {
            const validation = registerSchema.safeParse({
                name,
                email,
                password,
                confirmPassword,
            });

            if (!validation.success) {
                const message =
                    validation.error.issues[0]?.message ?? 'Invalid input';
                return { ok: false, error: message };
            }

            setLoading(true);

            try {
                // 1. Check user
                const users = await checkUserByEmail({ email });

                if (users.length > 0) {
                    return { ok: false, error: 'Email already in use' };
                }

                // 2. Create user
                await registerUser({ name, email, password });

                return { ok: true };
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Internal server error';
                return { ok: false, error: message };
            } finally {
                setLoading(false);
            }
        },
        [checkUserByEmail, registerUser]
    );

    return {
        register,
        loadingRegister: loading,
    };
};