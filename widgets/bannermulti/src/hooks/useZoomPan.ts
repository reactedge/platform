import { useState } from "react";

export const useZoomPan = () => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [cursor, setCursor] = useState({ x: 0.5, y: 0.5 });

    const handleClick = () => {
        setIsZoomed(true);
    };

    const handleMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!isZoomed) return;

        const rect = e.currentTarget.getBoundingClientRect();

        setCursor({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height
        });
    };

    const handleLeave = () => {
        setIsZoomed(false);
        setCursor({ x: 0.5, y: 0.5 });
    };

    const scale = isZoomed ? 2 : 1;

    const moveX = (scale - 1) * 100;
    const moveY = (scale - 1) * 100;

    const translateX = -moveX * (cursor.x - 0.5);
    const translateY = -moveY * (cursor.y - 0.5);

    const transform = `scale(${scale}) translate(${translateX}%, ${translateY}%)`;

    return {
        isZoomed,
        transform,
        handleClick,
        handleMove,
        handleLeave
    };
};