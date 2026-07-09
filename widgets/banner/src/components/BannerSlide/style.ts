// components/BannerSlide/style.ts
/**
 * Wrapper for each slide (slider mode)
 */
export const slideWrapper: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    opacity: 0,
    transition: "opacity 0.7s ease",
    pointerEvents: "none"
};

/**
 * When slide is active
 */
export const slideActive: React.CSSProperties = {
    opacity: 1,
    pointerEvents: "auto"
};

/**
 * Main image style
 */
export const slideImageBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover"
    // objectPosition is dynamic
};