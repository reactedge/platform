import {activity} from "./activity";

export interface ExplainerIllustration {
    svg: string;        // inline SVG string OR URL
    ariaHidden?: true;  // default true, no captions in v1
}

export type SectionType = "friction" | "impact" | "neutral";

export interface SectionData {
    type: SectionType;
    title: string;
    items: string[];
}

export interface CardData {
    selector: string;
    title: string;
    summary: string;
    sections: SectionData[];
    closing: string;
    illustration: ExplainerIllustration;
    layout?: "left" | "right";
}

export interface WidgetConfig {
    data: CardData,
    binding: {
        trigger: string
    }
}

export function readWidgetConfig(rawConfig: WidgetConfig): WidgetConfig {
    let contract = rawConfig

    activity('bootstrap', 'Config resolved', contract);

    return Object.freeze(contract);
}

export function resolveTrigger(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}
