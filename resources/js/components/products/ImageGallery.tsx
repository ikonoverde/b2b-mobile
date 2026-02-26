import type { ProductImage } from '@/types';

import { useActiveSlide } from './useActiveSlide';

interface ImageGalleryProps {
    images: ProductImage[];
    productName: string;
    onImageTap: (index: number) => void;
}

export function ImageGallery({ images, productName, onImageTap }: ImageGalleryProps) {
    const { scrollRef, activeIndex } = useActiveSlide(images.length);

    return (
        <div className="mx-6 mt-3 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06]">
            <div ref={scrollRef} className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        data-index={index}
                        className="bg-brand-cream aspect-square w-full shrink-0 snap-center"
                        onClick={() => onImageTap(index)}
                    >
                        <img src={image.url} alt={`${productName} ${index + 1}`} className="h-full w-full object-cover" />
                    </div>
                ))}
            </div>

            {images.length > 1 && (
                <div className="flex justify-center gap-1.5 py-2.5">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={[
                                'h-1.5 rounded-full transition-all duration-200',
                                index === activeIndex ? 'bg-brand-green w-4' : 'bg-brand-muted-green/40 w-1.5',
                            ].join(' ')}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
