import {checkbox} from "@inquirer/prompts";
import type {WidgetRegistry} from "./types.ts";

export async function selectWidgets(registry: WidgetRegistry): Promise<string[]> {
    const deployableWidgets =
        Object.keys(registry)
            .filter(
                key => !('widget' in registry[key])
            );

    return await checkbox({
        message: 'Select widgets to deploy',
        choices: deployableWidgets.map(
            widget => ({
                name: widget,
                value: widget
            })
        )
    });
}