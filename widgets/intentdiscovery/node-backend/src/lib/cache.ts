
export function stableHash(obj: unknown): string {
    return require("crypto")
        .createHash("sha256")
        .update(JSON.stringify(obj))
        .digest("hex");
}

