import { useCallback, useRef, useState } from 'react';

interface TouchState {
    startX: number;
    startY: number;
    startDistance: number;
    startScale: number;
    translateX: number;
    translateY: number;
    isPinching: boolean;
    isPanning: boolean;
}

function getTouchDistance(t1: React.Touch, t2: React.Touch): number {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

export function usePinchZoom() {
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const touchRef = useRef<TouchState>({
        startX: 0,
        startY: 0,
        startDistance: 0,
        startScale: 1,
        translateX: 0,
        translateY: 0,
        isPinching: false,
        isPanning: false,
    });

    function resetZoom(): void {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
    }

    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const distance = getTouchDistance(e.touches[0], e.touches[1]);
                touchRef.current = {
                    ...touchRef.current,
                    startDistance: distance,
                    startScale: scale,
                    isPinching: true,
                    isPanning: false,
                };
            } else if (e.touches.length === 1 && scale > 1) {
                touchRef.current = {
                    ...touchRef.current,
                    startX: e.touches[0].clientX,
                    startY: e.touches[0].clientY,
                    translateX: translate.x,
                    translateY: translate.y,
                    isPanning: true,
                    isPinching: false,
                };
            }
        },
        [scale, translate],
    );

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (touchRef.current.isPinching && e.touches.length === 2) {
                e.preventDefault();
                const distance = getTouchDistance(e.touches[0], e.touches[1]);
                const newScale = Math.min(3, Math.max(1, touchRef.current.startScale * (distance / touchRef.current.startDistance)));
                setScale(newScale);
                if (newScale <= 1) {
                    setTranslate({ x: 0, y: 0 });
                }
            } else if (touchRef.current.isPanning && e.touches.length === 1 && scale > 1) {
                const dx = e.touches[0].clientX - touchRef.current.startX;
                const dy = e.touches[0].clientY - touchRef.current.startY;
                const maxPan = (scale - 1) * 150;
                setTranslate({
                    x: Math.min(maxPan, Math.max(-maxPan, touchRef.current.translateX + dx)),
                    y: Math.min(maxPan, Math.max(-maxPan, touchRef.current.translateY + dy)),
                });
            }
        },
        [scale],
    );

    const handleTouchEnd = useCallback(() => {
        touchRef.current.isPinching = false;
        touchRef.current.isPanning = false;
        if (scale <= 1.05) {
            resetZoom();
        }
    }, [scale]);

    const handleDoubleTap = useCallback(() => {
        if (scale > 1) {
            resetZoom();
        } else {
            setScale(2);
        }
    }, [scale]);

    return {
        scale,
        translate,
        resetZoom,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleDoubleTap,
    };
}
