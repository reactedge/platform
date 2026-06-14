import {useState} from "react";
import {useUserState} from "../../state/User/useUserState.ts";
import {loginWithCredentials} from "../../domain/user/authentication.ts";

export const Sign: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { refreshUser, config} = useUserState()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
            setSubmitting(true);
            await loginWithCredentials(email, password, config);
            await refreshUser();
        } catch {
            setErrorMessage('Incorrect email or password');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="widget-form" onSubmit={handleSubmit}>
            <h3>Sign in to confirm your appointment</h3>

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <label>
                Email
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </label>

            <label>
                Password
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>

            <button type="submit" disabled={submitting}>
                {submitting ? 'Signing in…' : 'Sign in & continue'}
            </button>
        </form>

    );
};