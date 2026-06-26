import type {NavigationProps} from "./Types.ts";
import {dotActive, dotBase, dotsContainer} from "./NavigationDots/style.ts";

export const NavigationDots = ({ current, total, onChange }: NavigationProps) => {
    return (
        <div style={dotsContainer}>
            {Array.from({ length: total }).map((_, i) => (
                <span
                    key={i}
                    onClick={() => onChange(i)}
                    style={{
                        ...dotBase,
                        ...(i === current ? dotActive : {})
                    }}
                />
            ))}
        </div>
    );
};


