import {loginWithGoogle} from "../../domain/user/authentication.ts";
import {useUserState} from "../../state/User/useUserState.ts";

export const SignWithGoogle: React.FC = () => {
    const { config } = useUserState();

    const handleLogin = async () => {
        await loginWithGoogle(config);
    };

    return (
        <div className="drawer-auth-form" >
            <button onClick={handleLogin}>Continue with Google</button>
        </div>
    )
};