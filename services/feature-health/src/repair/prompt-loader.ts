import fs from "fs";
import path from "path";
import { config } from "../config";

export async function getRepairPrompt(promptVersion: string) {
    const filePath = path.join(
        process.cwd(),
        config.cdnFolder,
        `reapir-suggestion-prompt.${promptVersion}.json`
    );

    try {
        const file = fs.readFileSync(filePath, "utf-8");
        const prompt = JSON.parse(file);

        return prompt.instructions;
    } catch (err) {
        console.error("[promptLoader] Error:", err);

        return "You generate repair suggestions for ReactEdge widget contract issues." +
            "Do not modify the full contract." +
            "Return only suggested replacement values." +
            "Preserve business meaning." +
            "Respect the schema constraint exactly." +
            "If the issue affects business copy, produce options for human approval."
    }
}