export interface NavigationProps {
    current: number;
    total: number;
    onChange: (index: number) => void;
}

export interface BannerSliderProps {
    slides:  BannerSlide[];
    config: BannerSettingConfig;
    visibleSlides: number
}

export interface BannerStaticProps {
    slides:  BannerSlide[];
    config: BannerSettingConfig;
}

export interface BannerSlide {
    image: {
        src: string;
        srcset?: string;
        sizes?: string;
        alt?: string;
        focalPoint?: {
            x: number; // 0 → far left, 1 → far right
            y: number; // 0 → top, 1 → bottom
        };
    };
    title?:BannerTitle;
    subtitle?:string;
    cta?:string;
}

export interface BannerTitle {
    text: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    color?: string;
    background?: string;
    align?: "left" | "center" | "right";
}

export interface BannerSlideProps {
    slide: BannerSlide;
    tileMode: boolean
    isActive: boolean
    visibleSlides?: number
}

export type BannerModeValue = "static" | "slider" | "none";

export interface BannerSettingConfig {
    mode: BannerMode;
    imageHeight: number;
    imageWidth: number;
    visibleSlides?: number;
}

export interface BannerMode {
    desktop: BannerModeValue;
    tablet: BannerModeValue;
    mobile: BannerModeValue;
}