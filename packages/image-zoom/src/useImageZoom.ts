import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";

type Offset = {
    x: number;
    y: number;
};

type DragState = {
    pointerId: number;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
};

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.5;

function bound(value: number, limit: number): number {
    return Math.max(-limit, Math.min(limit, value));
}

function getPanLimits(stage: HTMLDivElement, scale: number): Offset {
    const image = stage.querySelector("img");
    if (!image) return { x: 0, y: 0 };

    return {
        x: Math.max(0, (image.offsetWidth * scale - stage.clientWidth) / 2),
        y: Math.max(0, (image.offsetHeight * scale - stage.clientHeight) / 2),
    };
}

export function useImageZoom(stageRef: RefObject<HTMLDivElement | null>) {
    const [scale, setScale] = useState(MIN_SCALE);
    const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
    const dragRef = useRef<DragState | null>(null);

    const setZoom = (nextScale: number) => {
        const boundedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
        setScale(boundedScale);
        if (boundedScale === MIN_SCALE) setOffset({ x: 0, y: 0 });
        else if (stageRef.current) {
            const limits = getPanLimits(stageRef.current, boundedScale);
            setOffset(current => ({
                x: bound(current.x, limits.x),
                y: bound(current.y, limits.y),
            }));
        }
    };

    const zoomIn = () => setZoom(scale + SCALE_STEP);
    const zoomOut = () => setZoom(scale - SCALE_STEP);
    const reset = () => {
        setScale(MIN_SCALE);
        setOffset({ x: 0, y: 0 });
        dragRef.current = null;
    };

    const panBy = (deltaX: number, deltaY: number) => {
        const stage = stageRef.current;
        if (!stage || scale === MIN_SCALE) return;
        const limits = getPanLimits(stage, scale);
        setOffset(current => ({
            x: bound(current.x + deltaX, limits.x),
            y: bound(current.y + deltaY, limits.y),
        }));
    };

    const startPan = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (scale === MIN_SCALE || event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            offsetX: offset.x,
            offsetY: offset.y,
        };
    };

    const movePan = (event: ReactPointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        const limits = getPanLimits(event.currentTarget, scale);
        setOffset({
            x: bound(drag.offsetX + event.clientX - drag.startX, limits.x),
            y: bound(drag.offsetY + event.clientY - drag.startY, limits.y),
        });
    };

    const stopPan = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
    };

    return { scale, offset, zoomIn, zoomOut, reset, panBy, startPan, movePan, stopPan };
}