export interface NavigationProps {
    current: number;
    total: number;
    onChange: (index: number) => void;
}

export interface UspSliderProps {
    slides:  UspSlideData[];
    config: UspSettings;
}

export interface UspStaticProps {
    slides:  UspSlideData[];
    config: UspSettings;
}

export interface UspSlideProps {
    slide: UspSlideData;
    isActive: boolean;
    showSeparator?: boolean;
}

export interface UspSlideData {
    heading?: string | undefined;
    text: string;
}

export type UspModeValue = "static" | "slider";

export type UspTheme = "light" | "dark" | "promo"

export interface UspSettings {
    mode: UspMode;
    theme: UspTheme
}

export interface UspMode {
    desktop: UspModeValue;
    tablet: UspModeValue;
    mobile: UspModeValue;
}

export const defaultUspSettings: UspMode = {
    desktop: "static",
    tablet: "slider",
    mobile: "slider"
};