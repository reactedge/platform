import {activity} from "../activity";

export interface GraphqlNormalizerOptions {
    patchOn?: boolean;
}

const PATCH_ON_DEFAULT = true;

export function normalizeGraphqlResponse(
    rawText: string
) {
    try {
        return JSON.parse(rawText);
    } catch (err) {
        if (!PATCH_ON_DEFAULT) {
            throw err;
        }

        // Demo-only fallback:
        // Extract the last JSON object from concatenated payload
        const idxData = rawText.indexOf('{"data"');
        const idxErrors = rawText.indexOf('{"errors"');

        const idx =
            idxData !== -1 && idxErrors !== -1 ? Math.min(idxData, idxErrors) :
                idxData !== -1 ? idxData :
                    idxErrors !== -1 ? idxErrors :
                        -1;

        if (idx === -1) {
            throw new Error("GraphQL fallback failed: cannot find JSON payload start.");
        }

        const candidate = rawText.slice(idx);

        activity('graphql-invalid-json', 'GraphQL normalised raw text', {
            candidate: candidate
        });

        try {
            const parsed = JSON.parse(candidate);

            console.warn("⚠ DEMO PATCH ACTIVE: GraphQL response was polluted. Fallback parser used.");

            return parsed;
        } catch {
            throw new Error("GraphQL fallback parsing failed.");
        }
    }
}
