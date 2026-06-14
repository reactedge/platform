import fs from "fs";
import path from "path";

import { config } from "../../config";
import {AttributesConfig, InterpretationConfig} from "../../types/intent-interpretation-context";

export async function getIntentPrompt(promptVersion: string) {
    const filePath = path.join(
        process.cwd(),
        config.cdnFolder,
        `intent-reommendation-prompt.${promptVersion}.json`
    );

    try {
        const file = fs.readFileSync(filePath, "utf-8");
        const prompt = JSON.parse(file);

        return prompt.instructions;
    } catch (err) {
        console.error("[promptLoader] Error:", err);

        return "You are a product recommendation engine for an e-commerce platform. " +
            "Based on weighted intent signals, select up to 5 relevant products. " +
            "Also generate a short summary sentence explaining how the suggestions relate to the user’s intent.";
    }
}

export async function getIntentInterpretationPrompt(promptVersion: string): Promise<InterpretationConfig> {
    const filePath = path.join(
        process.cwd(),
        config.cdnFolder,
        `intent-interpretation-prompt.${promptVersion}.json`
    );

    try {
        const file = fs.readFileSync(filePath, "utf-8");
        const prompt = JSON.parse(file);

        return prompt;
    } catch (err) {
        console.error("[promptLoader] Error:", err);

        return {
            "instructions": [
                "You are a product interpretation engine for an e-commerce platform.",
                "Your task is to translate a shopper's intent into product filters.",
                "You receive:",
                ",- an intent text",
                ",- weighted intent signals",
                ",- a list of attributes and their possible options",
                "",
                "Determine which attribute options best match the intent.",
                "",
                "Interpret semantic meaning, not just exact words.",
                "For example:",
                "- \"winter\", \"cold\", \"outdoor conditions\", may relate to climate attributes.",
                "- \"red\", \"blue\", \"black\", relate to color attributes.",
                "",
                "Important:",
                "Each option contains a \"label\" and a \"value\".",
                "You must return the VALUE of the option, not the label."
            ]
        };
    }
}