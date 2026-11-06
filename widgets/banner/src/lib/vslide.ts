export function getVisibleSlides(
    width: number,
    configVisibleSlides: number
) {
    let value = configVisibleSlides;

    if (width <= 640) value = configVisibleSlides / 4;
    else if (width <= 1024) value = configVisibleSlides / 2;

    return Math.max(1, Math.floor(value));
}