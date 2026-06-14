export interface NavigationProps {
    current: number;
    total: number;
    onChange: (index: number) => void;
}

export interface ExplainerSliderProps {
    slides:  ExplainerSlide[];
    config: ExplainerConfig;
}

export interface ExplainerStaticProps {
    slides:  ExplainerSlide[];
    config: ExplainerConfig;
}

export interface ExplainerSlideProps {
    slide: ExplainerSlide;
    isActive: boolean;
    tileMode: boolean;
    config: ExplainerConfig;
}

export interface ExplainerSlide {
    text: string,
    backgroundColor: string,
    textColor: string
}

export type ExplainerModeValue = "static" | "slider";

export interface ExplainerConfig {
    mode: ExplainerMode;
    height: string
    backgroundColor?: string;
}

export interface ExplainerMode {
    desktop: ExplainerModeValue;
    tablet: ExplainerModeValue;
    mobile: ExplainerModeValue;
}

export const defaultExplainerConfig: ExplainerConfig = {
    mode: {
        desktop: "static",
        tablet: "slider",
        mobile: "slider"
    },
    height: "50px",
};