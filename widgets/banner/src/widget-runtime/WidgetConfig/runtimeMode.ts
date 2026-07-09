export type RuntimeLoadMode = "auto" | "eager" | "lazy" | "manual";

export function parseRuntimeLoadMode(
    value?: string
): RuntimeLoadMode {
    switch (value) {
        case "eager":
        case "lazy":
        case "manual":
            return value;
        default:
            return "auto";
    }
}
