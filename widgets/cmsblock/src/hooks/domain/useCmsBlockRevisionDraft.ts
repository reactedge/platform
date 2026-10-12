import { useEffect, useState } from "react";
import type { CmsBlockController } from "./useCmsBlockController.ts";
import type { CmsBlockRecord } from "../../services/cmsblock/CmsBlockApi.ts";
import { useSystemState } from "../../state/System/useSystemState.ts";

type Props = {
    controller: CmsBlockController;
    pending: CmsBlockRecord["pending"] | undefined;
    onDirtyChange: (dirty: boolean) => void;
};

export function useCmsBlockRevisionDraft({ controller, pending, onDirtyChange }: Props) {
    const { cmsBlockApi } = useSystemState();
    const [html, setHtml] = useState(pending?.html ?? "");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        setHtml(pending?.html ?? "");
        setError("");
        setMessage("");
    }, [pending?.revision]);

    const dirty = Boolean(pending && html !== pending.html);
    useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);

    const save = async () => {
        if (!pending) return;
        setBusy(true);
        setError("");
        setMessage("");
        try {
            const updated = await cmsBlockApi.updatePending({
                html,
                css: pending.css,
                revision: pending.revision,
            });
            if (!updated?.pending) throw new Error("Pending revision was not returned.");
            controller.setRecord(updated);
            setMessage("Manual HTML changes saved to pending revision.");
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Could not save edits.");
        } finally {
            setBusy(false);
        }
    };

    const discard = () => setHtml(pending?.html ?? "");

    return { html, setHtml, busy, error, message, dirty, save, discard };
}
