import tokens from "./widget-tokens.css?inline";
import dots from "./banner.dots.css?inline";
import slide from "./banner.slide.css?inline";
import slider from "./banner.slider.css?inline";
import staticstyle from "./banner.static.css?inline";
import arrows from "./banner.arrows.css?inline";
import banner from "./banner.css?inline";

export const bannerStyles = [
    tokens,   // MUST be first,
    staticstyle,
    arrows,
    slider,
    slide,
    dots,
    banner
];
