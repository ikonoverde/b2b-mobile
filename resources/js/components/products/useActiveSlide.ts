import { useEffect, useRef, useState } from 'react';

export function useActiveSlide(itemCount: number, initialIndex = 0) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(initialIndex);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        if (!Number.isNaN(index)) {
                            setActiveIndex(index);
                        }
                    }
                }
            },
            { root: container, threshold: 0.6 },
        );

        const slides = container.querySelectorAll('[data-index]');
        slides.forEach((slide) => observer.observe(slide));

        return () => observer.disconnect();
    }, [itemCount]);

    return { scrollRef, activeIndex };
}
