export const logger = {
    info(message: string, meta?: unknown) {
        console.log(message, meta ?? '');
    },

    error(message: string, error?: unknown) {
        console.error(message, error ?? '');
    },

    debug(message: string, meta?: unknown) {
        if (process.env.DEBUG === 'true') {
            console.debug(message, meta ?? '');
        }
    }
};