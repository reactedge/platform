import type {Translations} from "../domain/megamenu.types.ts";

let translations: Translations = {};

export function setTranslations(t: Translations) {
    translations = t;
}

export function __(key: string): string {
    return translations[key] ?? key;
}

export function __n(key: string, value: number): string {
    let translated = __(key);
    return translated.replace("%1", String(value));
}