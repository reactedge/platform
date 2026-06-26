import {setTranslations} from "../lib/i18n";

export const loadTranslations = (el: HTMLElement) => {
    const raw = el.getAttribute("data-translations");
    try {
        const translations = raw ? JSON.parse(raw) : {};
        setTranslations(translations);
    } catch (e) {
        console.error("Invalid translation JSON", raw);
        return {};
    }
}