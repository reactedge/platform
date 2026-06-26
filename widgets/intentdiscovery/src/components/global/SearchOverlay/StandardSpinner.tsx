import {Circle} from "./Circle.tsx";


type SpinnerProps = {
    size?: number;
};

export function StandardSpinner({ size = 40 }: SpinnerProps) {

    return (
        <div className="standard-widget-loader-wrapper" role="status" aria-label="Loading">
            <Circle size={size} />
        </div>
    );
}
