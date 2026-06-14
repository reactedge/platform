// Typography sizes
export const mapSize = (token?: string) => {
    switch (token) {
        case "xl": return "48px";
        case "lg": return "36px";
        case "md": return "22px";
        case "sm": return "16px";
        default: return "22px";
    }
};

// Background opacity
export const mapBg = (token?: string) => {
    switch (token) {
        case "dark-20": return "rgba(0,0,0,0.2)";
        case "dark-40": return "rgba(0,0,0,0.4)";
        case "dark-60": return "rgba(0,0,0,0.6)";
        default: return "transparent";
    }
};

// Padding
export const mapPadding = (token?: string) => {
    switch (token) {
        case "sm": return "6px 10px";
        case "md": return "10px 18px";
        case "lg": return "16px 24px";
        default: return "0px";
    }
};

// Border radius
export const mapRadius = (token?: string) => {
    switch (token) {
        case "sm": return "6px";
        case "md": return "10px";
        case "lg": return "14px";
        default: return "0px";
    }
};

// CTA Variants
export const mapCtaBg = (variant?: string) => {
    switch (variant) {
        case "primary": return "#0071e3";
        case "secondary": return "rgba(255,255,255,0.8)";
        case "ghost": return "rgba(0,0,0,0.3)";
        default: return "#0071e3";
    }
};
