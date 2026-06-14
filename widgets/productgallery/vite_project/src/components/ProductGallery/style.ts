export const containerStyle: React.CSSProperties = {
    padding: "20px",
    textAlign: "center",
    position: "relative",
};

export const mainImageStyle: React.CSSProperties = {
    width: "100%",
    height: "auto",
    maxHeight: "75vh",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    transition: "opacity 0.3s ease",
    objectFit: "contain",
};

export const thumbnailStrip: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "20px",
};

export const thumb: React.CSSProperties = {
    width: "140px",
    height: "140px",
    objectFit: "cover",
    borderRadius: "8px",
    cursor: "pointer",
    opacity: 0.7,
    transition: "opacity 0.2s ease, transform 0.2s ease",
    border: "2px solid #e0e0e0",    // << grey border
};

export const activeThumb: React.CSSProperties = {
    opacity: 1,
    transform: "scale(1.02)",
    border: "2px solid #555",       // << darker border for active state
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
    padding: "10px",
    borderRadius: "8px",
};