type SpinnerProps = {
    size?: number;
    className?: string;
};

export function Spinner({ size = 40 }: SpinnerProps) {
    return (
        <div className="widget-loader-wrapper" role="status" aria-label="Loading">
            <svg
                width={size}
                height={size}
                viewBox="0 0 50 50"
                aria-hidden="true"
            >
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="#d3cdcd"
                    strokeWidth="4"
                    strokeDasharray="31.4 31.4"
                    strokeLinecap="round"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 25 25"
                        to="360 25 25"
                        dur="0.8s"
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
        </div>
    );
}
