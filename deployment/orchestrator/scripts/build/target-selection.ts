import fs from "fs";
import { select } from '@inquirer/prompts';

export async function selectTarget() {
    const targets =
        fs.readdirSync(process.cwd())
            .filter(
                file => file.startsWith('.env.')
            );

    const target = await select({
        message: 'Select deployment target',
        choices: targets.map(
            target => ({
                name: target.replace('.env.', ''),
                value: target
            })
        )
    });

    return target
}