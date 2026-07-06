import { useState } from "react";
import {buildInitialValues} from "../lib/form.ts";
import {useActivityContext} from "../activity/Context/useActivityContext.ts";

type ControllerStatus = "idle" | "loading" | "success" | "error";

export function useContactController(
    endpoint: string,
    fields: { name: string }[]
) {
    const [values, setValues] = useState<Record<string, string>>(
        () => buildInitialValues(fields)
    );
    const activity = useActivityContext()

    const [status, setStatus] = useState<ControllerStatus>("idle");

    const update = (name: string, value: string) => {
        setValues((v) => ({
            ...v,
            [name]: value,
        }));
    };

    const reset = () => {
        activity.log('form-submit', 'Form Submit Reset',null);
        setValues(buildInitialValues(fields));
        setStatus("idle");
    };

    const submit = async (extra: Record<string, unknown> = {}) => {
        setStatus("loading");

        activity.log('submit', 'Submit Form');

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
                activity.log('form-submit', 'Form Submit Error',{
                    fields: values,
                    ...extra,
                }, 'error');
                throw new Error();
            }

            setStatus("success");
        } catch {
            activity.log('submit', 'API error', null , 'error');
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
