import type {WidgetConfig} from "../domain/contact.types.ts";

type ContactFormProps = {
    config: WidgetConfig;

    values: Record<string, string>;
    category?: string;

    onChange: (name: string, value: string) => void;
    onCategoryChange?: (value: string) => void;

    onSubmit: () => void;
    disabled?: boolean;
    status?: "idle" | "loading" | "success" | "error";
};

export function ContactForm({
        config,
        values,
        category,
        onChange,
        onCategoryChange,
        onSubmit,
        disabled,
        status,
    }: ContactFormProps) {
    return (
        <form
            className="contact"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            data-contact-form
        >
            {config.categories && onCategoryChange && (
                <div className="contact__field">
                    <label>Reason</label>
                    <select
                        value={category || ""}
                        onChange={(e) => onCategoryChange(e.target.value)}
                    >
                        <option value="">Select</option>
                        {config.categories.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {config.fields.map((field) => (
                <div key={field.name} className="contact__field">
                    <label>{field.label}</label>

                    {field.type === "textarea" ? (
                        <textarea required={field.required}
                            value={values[field.name] || ""}
                            onChange={(e) =>
                                onChange(field.name, e.target.value)
                            }
                            data-field-name={field.name}
                            data-contact-field
                        />
                    ) : (
                        <input type={field.type || "text"}
                            required={field.required}
                            value={values[field.name] || ""}
                            onChange={(e) =>
                                onChange(field.name, e.target.value)
                            }
                            data-field-name={field.name}
                            data-contact-field
                        />
                    )}
                </div>
            ))}

            <button type="submit" disabled={disabled} data-contact-submit>
                {status === "loading" ? "Sending…" : "Send"}
            </button>
        </form>
    );
}
