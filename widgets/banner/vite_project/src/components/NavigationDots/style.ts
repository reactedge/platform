export const dotsContainer: React.CSSProperties = {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "8px",
    zIndex: 18
};

export const dotBase: React.CSSProperties = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#ccc",
    cursor: "pointer",
    transition: "background 0.3s ease"
};

export const dotActive: React.CSSProperties = {
    background: "#333"
};