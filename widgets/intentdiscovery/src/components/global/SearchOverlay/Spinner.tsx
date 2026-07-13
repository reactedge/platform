import {Circle} from "./Circle.tsx";


type SpinnerProps = {
    size?: number;
};

export function Spinner({ size = 40 }: SpinnerProps) {

    return (
        <div className="widget-loader-wrapper" role="status" aria-label="Loading">
            <Circle size={size} />
        </div>
    );
}
