export const loadMagentoFonts = () => {
    const bodyFont = getComputedStyle(document.body).fontFamily;
    document.documentElement.style.setProperty('--mag-font', bodyFont);
}