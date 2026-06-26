import React from 'react';
import type { NavigationProps } from "./Types.ts";
import {handleArrowButtonKeyDown} from "../lib/keyboard.ts";

export function NavigationArrows({ current, total, onChange }: NavigationProps) {
    const prev = () => onChange(current === 0 ? total - 1 : current - 1);
    const next = () => onChange(current === total - 1 ? 0 : current + 1);

    return (
        <div className="navigation-arrows">
            <button className="arrow-btn" onClick={prev} onKeyDown={(e) =>
                handleArrowButtonKeyDown(e, prev, ['ArrowLeft', 'Enter', ' '])
            } data-usp-prev>‹</button>

            <button className="arrow-btn" onClick={next} onKeyDown={(e) =>
                handleArrowButtonKeyDown(e, next, ['ArrowRight', 'Enter', ' '])
            } data-usp-next>›</button>
        </div>
    );
};
