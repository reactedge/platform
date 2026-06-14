import 'dotenv/config';

const ENV = process.env.NODE_ENV || 'dev';

export const CONFIG = {
    dev: {
        widgetsDir: process.env.WP_WIDGETS_DIR,
        scriptDir: process.env.WP_SCRIPTS_DIR,
        jsDir: process.env.WP_JS_DIR
    },
    live: {
        widgetsDir: process.env.WP_WIDGETS_DIR
    }
};

