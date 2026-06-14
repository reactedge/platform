// src/styles/minicartStyles.ts

export const backdropStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.4)",
    zIndex: 10,
};

export const drawerBaseStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    width: "400px",
    background: "white",
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
    transition: "transform 0.3s ease",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
};

export const drawerOpenStyle: React.CSSProperties = {
    transform: "translateX(0)",
};

export const drawerClosedStyle: React.CSSProperties = {
    transform: "translateX(100%)",
};

export const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

export const closeButtonStyle: React.CSSProperties = {
    cursor: "pointer",
    background: "transparent",
    border: "none",
    fontSize: "20px",
};

export const itemsContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
};

export const openButtonStyle: React.CSSProperties = {
    position: "fixed",
    top: "16px",
    right: "16px",
    background: "black",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    zIndex: 100,
    cursor: "pointer",
};

export const itemRowStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
    alignItems: "center",
};

export const itemImageStyle: React.CSSProperties = {
    borderRadius: "4px",
    objectFit: "cover",
    border: "1px solid #ddd",
};
