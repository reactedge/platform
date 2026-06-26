export function getVisibleSlides(
    isMobile: boolean,
    isTablet: boolean,
    configVisibleSlides: number
) {
    let value = configVisibleSlides;

    if (isMobile) value = configVisibleSlides / 4;
    else if (isTablet) value = configVisibleSlides / 2;

    return Math.max(1, Math.floor(value));
}