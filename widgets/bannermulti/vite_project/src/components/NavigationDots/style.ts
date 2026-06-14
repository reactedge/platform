export const dotsContainer: React.CSSProperties = {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    marginTop: "12px"
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