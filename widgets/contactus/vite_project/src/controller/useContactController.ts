import { useState } from "react";
import {buildInitialValues} from "../lib/form.ts";
import {activity} from "../activity";

type ControllerStatus = "idle" | "loading" | "success" | "error";

export function useContactController(
    endpoint: string,
    fields: { name: string }[]
) {
    const [values, setValues] = useState<Record<string, string>>(
        () => buildInitialValues(fields)
    );

    const [status, setStatus] = useState<ControllerStatus>("idle");

    const update = (name: string, value: string) => {
        setValues((v) => ({
            ...v,
            [name]: value,
        }));
    };

    const reset = () => {
        activity('form-submit', 'Form Submit Reset',null);
        setValues(buildInitialValues(fields));
        setStatus("idle");
    };

    const submit = async (extra: Record<string, unknown> = {}) => {
        setStatus("loading");

        activity('submit', 'Submit Form');

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fields: values,
                    ...extra,
                }),
            });

            if (!res.ok) {
                activity('form-submit', 'Form Submit Error',{
                    fields: values,
                    ...extra,
                }, 'error');
                throw new Error();
            }

            setStatus("success");
        } catch {
            activity('submit', 'API error', null , 'error');
            setStatus("error");
        }
    };

    return {
        values,
        update,
        submit,
        status,
        reset,
    };
}
