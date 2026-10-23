import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
    {
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/coverage/**",
            "**/release/**",
            "**/workspace/**",
            "**/*.min.js",
            "**/*.cjs"
        ]
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        rules: {
            "max-lines-per-function": ["warn", {
                max: 250,
                skipBlankLines: false,
                skipComments: false,
                IIFEs: true
            }]
        }
    },

    {
        files: ["**/*.{ts,tsx}"],

        languageOptions: {
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module"
            },
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },

        plugins: {
            react,
            "react-hooks": reactHooks
        },

        settings: {
            react: {
                version: "detect"
            }
        },

        rules: {
            "no-console": "warn",
            "no-debugger": "error",

            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/consistent-type-imports": "warn",

            "react/react-in-jsx-scope": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn"
        }
    },

    {
        files: ["services/orchestrator/**/*.{ts,tsx}"],
        rules: {
            "no-console": "off",
            complexity: ["warn", { max: 15 }]
        }
    },
    {
        files: ["widgets/**/*.{ts,tsx}"],
        rules: {
            "no-console": "error"
        }
    },

    {
        files: ["launcher/control-panel/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser
            }
        }
    },

    {
        files: ["services/orchestrator/**/*.{ts,tsx}"],
        rules: {
            complexity: ["warn", { max: 15 }]
        }
    }
];
