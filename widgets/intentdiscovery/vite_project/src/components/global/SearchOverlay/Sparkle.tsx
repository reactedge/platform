export const Sparkle = () => {
    const sparkles = [
        { left: -40, top: 0, color: "#6366f1" },
        { left: 30, top: -10, color: "#ec4899" },
        { left: 60, top: 20, color: "#22c55e" },
        { left: -20, top: 25, color: "#f59e0b" }
    ];

    return (
        <div className="sparkles">
            {sparkles.map((s, i) => (
                <div
                    key={i}
                    className="sparkle"
                    style={{
                        left: s.left,
                        top: s.top,
                        background: s.color
                    }}
                />
            ))}
        </div>
    )
}