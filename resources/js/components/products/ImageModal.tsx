import { X } from 'lucide-react';
import { useEffect } from 'react';

import type { ProductImage } from '@/types';

import { useActiveSlide } from './useActiveSlide';
import { usePinchZoom } from './usePinchZoom';

interface ImageModalProps {
    images: ProductImage[];
    initialIndex: number;
    onClose: () => void;
}

export function ImageModal({ images, initialIndex, onClose }: ImageModalProps) {
    const { scrollRef, activeIndex } = useActiveSlide(images.length, initialIndex);
    const { scale, translate, resetZoom, handleTouchStart, handleTouchMove, handleTouchEnd, handleDoubleTap } = usePinchZoom();

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        container.scrollLeft = initialIndex * container.offsetWidth;
    }, [initialIndex, scrollRef]);

    useEffect(() => {
        resetZoom();
    }, [activeIndex, resetZoom]);

    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* Header */}
            <div className="pt-safe-top absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pb-2">
                <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                    <X className="h-5 w-5 text-white" />
                </button>
                {images.length > 1 && (
                    <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                        {activeIndex + 1} / {images.length}
                    </span>
                )}
            </div>

            {/* Image carousel */}
            <div
                ref={scrollRef}
                className={['scrollbar-hide flex h-full snap-x snap-mandatory overflow-x-auto', scale > 1 ? 'overflow-x-hidden' : ''].join(' ')}
            >
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        data-index={index}
                        className="flex h-full w-full shrink-0 snap-center items-center justify-center"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onDoubleClick={handleDoubleTap}
                    >
                        <img
                            src={image.url}
                            alt={`Image ${index + 1}`}
                            className="max-h-full max-w-full object-contain transition-transform duration-100"
                            style={{
                                transform:
                                    index === activeIndex
                                        ? `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`
                                        : undefined,
                            }}
                            draggable={false}
                        />
                    </div>
                ))}
            </div>

            {/* Dot indicators */}
            {images.length > 1 && (
                <div className="pb-safe-bottom absolute inset-x-0 bottom-0 flex justify-center gap-1.5 pt-2">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={[
                                'h-1.5 rounded-full transition-all duration-200',
                                index === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40',
                            ].join(' ')}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
