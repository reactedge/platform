import {useContactController} from "../controller/useContactController.ts";
import {useState} from "react";
import {SuccessForm} from "./SuccessForm.tsx";
import {ContactForm} from "./ContactForm.tsx";
import {Turnstile} from "../security/Turnstile.tsx";
import type {ContactUsConfig} from "../domain/contact.types.ts";
import {activity} from "../activity";
import {useSystemState} from "../state/System/useSystemState.ts";
import {ContactHeader} from "./ContactHeader.tsx";

type Props = {
    config: ContactUsConfig;
};

export function ContactUsWrapper({ config }: Props) {
    const { values, update, submit, status } =
        useContactController(config.endpoint || '', config.fields);

    const [token, setToken] = useState<string | null>(null);
    const [category, setCategory] = useState("");
    const { cloudflareKey, isTurnstileEnabled } = useSystemState()

    const turnstileEnabled = isTurnstileEnabled();
    const canSubmit =
        status !== "loading" &&
        (!turnstileEnabled || Boolean(token));

    if (status === 'success') return <SuccessForm />

    if (!turnstileEnabled) {
        activity('form-ready', 'Turnstile Disabled',{
            cloudflareKey
        }, 'warn');
    }

    activity('form-ready', 'Can submit',{
        status,
        turnstileEnabled,
        token
    });

    return (
        <>
            <ContactHeader config={config} />
            {/* 1. The form */}
            <ContactForm
                config={config}
                values={values}
                category={category}
                onChange={update}
                onCategoryChange={setCategory}
                onSubmit={() => submit({
                    category,
                    turnstileToken: token,
                    origin: window.location.hostname
                })}
                disabled={!canSubmit}
                status={status}
            />

            {/* 2. The security gate */}
            {turnstileEnabled && (
                <Turnstile
                    siteKey={cloudflareKey}
                    containerId="contactus-turnstile"
                    onToken={setToken}
                />
            )}
        </>
    );
}
