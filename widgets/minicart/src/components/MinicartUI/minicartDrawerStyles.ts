export const buttonWrapper: React.CSSProperties = {
    position: "relative",
    float: "right",
    cursor: "pointer",
    marginLeft: "10px",
}

export const badgeStyle: React.CSSProperties = {
    position: "absolute",
    top: "-8px",
    right: "-20px",
    backgroundColor: "var(--secondary-color)",
    color: "white",
    borderRadius: "50%",
    padding: "4px 6px",
    fontSize: "12px",
    minWidth: "16px",
    height: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    lineHeight: 1,
    zIndex: 201,
};


// Open cart trigger button
export const openCartButtonStyle: React.CSSProperties = {
    background: "var(--primary-color)",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    zIndex: 200,
};

export const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: "16px"
};

export const footerStyle: React.CSSProperties = {
    flexShrink: 0,
    padding: "16px",
    borderTop: "1px solid #ddd",
};
