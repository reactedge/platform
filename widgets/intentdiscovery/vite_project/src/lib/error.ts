export function getError(err: unknown): Error {
    if (err instanceof Error) {
        return err;
    } else {
        return {
            name: "unknonw",
            message: err as string
        };
    }
}