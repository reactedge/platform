export interface NavigationProps {
    current: number;
    total: number;
    onChange: (index: number) => void;
}

export interface BannerSliderProps {
    slides:  BannerSlide[];
    config: BannerSettingConfig;
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
    };
}

export interface BannerSlideProps {
    slide: BannerSlide;
    isActive: boolean;
    tileMode: boolean
    height?: number
}

export type BannerModeValue = "static" | "slider" | "none";

export interface BannerSsrSettings {
    height: number
}

export interface BannerSettingConfig {
    mode: BannerMode;
    imageHeight: number;
    imageWidth: number;
    ssr?: BannerSsrSettings
}

export interface BannerMode {
    desktop: BannerModeValue;
    tablet: BannerModeValue;
    mobile: BannerModeValue;
}