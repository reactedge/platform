import { useEffect, useState } from "react";
import type { WidgetConfig } from "../../Config.ts";
import {
    legacyLayoutForTemplate,
    type CmsBlockDraft,
    type CmsBlockTemplateId,
} from "../../Model/CmsBlock.ts";
import type { CmsBlockLayoutId } from "../../Model/CmsBlockLayout.ts";
import type { CmsBlockRecord } from "../../services/cmsblock/CmsBlockApi.ts";
import { useSystemState } from "../../state/System/useSystemState.ts";

export function useCmsBlockController(
    config: WidgetConfig,
    initialRecord?: CmsBlockRecord | null
) {
    const { cmsBlockApi } = useSystemState();
    const initialDraft = (): CmsBlockDraft => ({
        source: { ...config.data.source },
        templateId: config.data.templateId,
        layoutId: config.data.layoutId ?? legacyLayoutForTemplate(config.data.templateId),
        ...(config.data.image ? { image: config.data.image } : {}),
    });

    const [draft, setDraft] = useState<CmsBlockDraft>(initialDraft);
    const [savedDraft, setSavedDraft] = useState<CmsBlockDraft>(initialDraft);
    const [record, setRecord] = useState<CmsBlockRecord | null>(initialRecord ?? null);
    const [busy, setBusy] = useState(false);
    const [loading, setLoading] = useState(initialRecord === undefined);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [mode, setMode] = useState<"edit" | "review" | "view">(
        initialRecord?.pending ? "review" : initialRecord?.published ? "view" : "edit"
    );
    const [showSourcePreview, setShowSourcePreview] = useState(false);

    useEffect(() => {
        let active = true;
        if (initialRecord !== undefined) {
            setLoading(false);
            return () => { active = false; };
        }
        void cmsBlockApi.get()
            .then((found) => {
                if (!active || !found) return;
                setRecord(found);
                const saved = {
                    source: found.source,
                    templateId: found.templateId,
                    layoutId: found.layoutId ?? legacyLayoutForTemplate(found.templateId),
                    ...(found.image ? { image: found.image } : {}),
                };
                setSavedDraft(saved);
                setDraft(saved);
                if (found.pending) setMode("review");
                else if (found.published) setMode("view");
            })
            .catch((reason: unknown) => {
                if (active) setError(reason instanceof Error ? reason.message : "Could not load CMSBlock.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, [cmsBlockApi, initialRecord]);

    const changed = JSON.stringify(draft) !== JSON.stringify(savedDraft);

    const updateContent = (content: string) => setDraft((current) => ({
        ...current, source: { ...current.source, content },
    }));
    const updateFormat = (format: CmsBlockDraft["source"]["format"]) => setDraft((current) => ({
        ...current, source: { ...current.source, format },
    }));
    const updateTemplate = (templateId: CmsBlockTemplateId) => setDraft((current) => ({
        ...current, templateId,
    }));
    const updateImage = (field: "src" | "alt", value: string) => setDraft((current) => ({
        ...current, image: { ...(current.image ?? { src: "", alt: "" }), [field]: value },
    }));
    const updateLayout = (layoutId: CmsBlockLayoutId) => setDraft((current) => ({
        ...current, layoutId,
    }));
    const reset = () => setDraft({ ...savedDraft, source: { ...savedDraft.source } });

    const execute = async (
        operation: () => Promise<CmsBlockRecord | null>,
        success: string
    ) => {
        setBusy(true);
        setError("");
        setMessage("");
        try {
            const next = await operation();
            if (!next) throw new Error("The CMSBlock service returned an empty record.");
            setRecord(next);
            setMessage(success);
            return next;
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "CMSBlock request failed.");
            return null;
        } finally {
            setBusy(false);
        }
    };

    const save = async () => {
        if (!draft.source.content.trim()) {
            setError("Enter content before saving.");
            return;
        }
        const next = await execute(() => cmsBlockApi.save(draft), "Source and template saved.");
        if (next) {
            setSavedDraft({
                source: next.source,
                templateId: next.templateId,
                layoutId: next.layoutId ?? legacyLayoutForTemplate(next.templateId),
                ...(next.image ? { image: next.image } : {}),
            });
            setMode("edit");
        }
    };

    const generate = async () => {
        if (changed) {
            setError("Save your changes before generating.");
            return;
        }
        const next = await execute(() => cmsBlockApi.generate(), "Generated draft ready for review.");
        if (next?.pending) setMode("review");
    };

    const approve = async () => {
        const next = await execute(() => cmsBlockApi.approve(), "Block approved and published.");
        if (next) setMode("view");
    };
    const reject = async () => {
        const next = await execute(
            () => cmsBlockApi.reject(),
            "Draft rejected; previously published block remains unchanged."
        );
        if (next) setMode("edit");
    };

    return {
        draft, record, setRecord, changed, busy, loading, error, message, mode, setMode,
        showSourcePreview, setShowSourcePreview,
        updateContent, updateFormat, updateTemplate, updateLayout, updateImage,
        reset, save, generate, approve, reject,
    };
}

export type CmsBlockController = ReturnType<typeof useCmsBlockController>;
