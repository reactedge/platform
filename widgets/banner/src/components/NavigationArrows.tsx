import type {NavigationProps} from "./Types.ts";
import {handleArrowButtonKeyDown} from "../lib/keyboard.ts";
import {useActivityContext} from "../activity/Context/useActivityContext.ts";

export const NavigationArrows = ({ current, total, onChange }: NavigationProps) => {
    const activity = useActivityContext()

    const prev = () => {
        activity.log('navigation', 'Slide navigation', {
            "direction": "left"
        });
        const newIndex = current === 0 ? total - 1 : current - 1;
        onChange(newIndex);
    };

    const next = () => {
        activity.log('navigation', 'Slide navigation', {
            "direction": "right"
        });
        const newIndex = current === total - 1 ? 0 : current + 1;
        onChange(newIndex);
    };

    return (
        <div className="arrows-container">
            <button className="arrow-btn" onClick={prev} onKeyDown={(e) =>
                handleArrowButtonKeyDown(e, prev, ['ArrowLeft', 'Enter', ' '])
            } data-banner-prev>‹</button>
            <button className="arrow-btn" onClick={next} onKeyDown={(e) =>
                handleArrowButtonKeyDown(e, next, ['ArrowRight', 'Enter', ' '])
            } data-banner-next>›</button>
        </div>
    );
};


