import {Sign} from "./Sign.tsx";
import {useUserState} from "../../state/User/useUserState.ts";
import {Spinner} from "../global/Spinner.tsx";
import {SignWithGoogle} from "./SignWithGoogle.tsx";
import {useEventState} from "../../state/Event/useEventState.ts";

export const SignInOrRegister: React.FC = () => {
    const {loading} = useUserState();
    const { showSignUp } = useEventState()

    if (loading) return <Spinner />

    return (
        <div className="drawer-auth">
            <Sign />
            <SignWithGoogle />
            <div className="drawer-auth-switch">
                New here? <button onClick={showSignUp}>Sign up</button>
            </div>
        </div>
    )
}
