export const resolveColors = () => {
    resolvePrimaryColor();
    resolveSecondaryColor();
}

export const resolvePrimaryColor = () => {
    const el = document.querySelector(".action.primary");

    if (!el) return null;

    const color = getComputedStyle(el).backgroundColor;

    if (color) {
        document.documentElement.style.setProperty(
            "--primary-color",
            color
        );
    }
}

export const resolveSecondaryColor = () => {
    const el = document.querySelector(".counter.qty");

    if (!el) return null;

    const color = getComputedStyle(el).backgroundColor;

    if (color) {
        document.documentElement.style.setProperty(
            "--secondary-color",
            color
        );
    }
}