import {useState} from "react";
import {useRegisterUser} from "../../hooks/domain/useRegisterUser.tsx";
import {Spinner} from "../global/Spinner.tsx";

interface SignUpProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSuccess, onCancel }) => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const { register, loadingRegister } = useRegisterUser();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const canSubmit = status !== "loading";

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValues(v => ({ ...v, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await submitSignUp()
    }

    async function submitSignUp() {
        setError(null);

        if (values.password !== values.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const result = await register(
                values.name,
                values.email,
                values.password,
                values.confirmPassword
            );

            if (!result.ok) {
                setError(result.error);
                return;
            }

            onSuccess?.();
        } catch {
            setError('Signup failed');
        } finally {
            setLoading(false);
        }
    }

    if (loadingRegister) return <Spinner />

    return (
            <form className="widget-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>

                {error && <p className="form-error">{error}</p>}

                <fieldset disabled={loading}>
                    <label>
                        Name
                        <input
                            name="name"
                            required
                            value={values.name}
                            onChange={handleChange}
                            autoComplete="name"
                        />
                    </label>

                    <label>
                        Email
                        <input
                            name="email"
                            type="email"
                            required
                            value={values.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                    </label>

                    <label>
                        Password
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            value={values.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </label>

                    <label>
                        Confirm Password
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            value={values.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </label>

                    <button type="submit"
                            disabled={!canSubmit}
                    >
                        {loading ? 'Signing up…' : 'Sign Up'}
                    </button>

                    {onCancel && (
                        <button type="button" onClick={onCancel}>
                            Already have an account? Sign in
                        </button>
                    )}
                </fieldset>
            </form>
    );
};