export const galleryStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    padding: "20px",
};

export const cardStyle: React.CSSProperties = {
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
    transition: "transform 0.2s ease",
};

export const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "auto",
    display: "block",
};

export const hiddenStyle: React.CSSProperties = {
    opacity: 0,
    transform: "translateY(10px)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
};

export const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: "translateY(0px)",
};

export const zoomContainer: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    padding: "20px",
    textAlign: "center",
};

export const arrowBase: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "40px",
    cursor: "pointer",
    color: "#555",
    opacity: 0.7,
    userSelect: "none",
};

export const minifyButton: React.CSSProperties = {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "6px 12px",
    background: "#000",
    color: "#fff",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    opacity: 0.8,
};

export const fadeStyle = {
    transition: "opacity 0.3s ease",
};