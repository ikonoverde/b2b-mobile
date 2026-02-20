import { Link, router } from '@inertiajs/react';
import { Check, Plus, Star } from 'lucide-react';
import { useState } from 'react';

import { formatCurrency } from '@/lib/format';

interface CatalogProductCardProps {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    isFeatured?: boolean;
}

export function CatalogProductCard({ id, name, category, price, image, isFeatured }: CatalogProductCardProps) {
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);

    function addToCart(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        router.post(
            '/cart/items',
            { product_id: id, quantity: 1 },
            {
                preserveScroll: true,
                preserveState: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
                onSuccess: () => {
                    setAdded(true);
                    setTimeout(() => setAdded(false), 1500);
                },
            },
        );
    }

    return (
        <Link
            href={`/product/${id}`}
            className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03] transition-shadow duration-200 active:shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream">
                <img src={image} alt={name} className="h-full w-full object-cover" />
                {isFeatured && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-brand-accent-brown/90 px-2 py-0.5 backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-white text-white" />
                        <span className="text-[10px] font-semibold text-white">Destacado</span>
                    </span>
                )}
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/10 to-transparent" />
                <span className="absolute bottom-1.5 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-brand-muted-text backdrop-blur-sm">
                    {category}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-2 p-3">
                <span className="line-clamp-2 text-[13px] leading-[1.3] font-semibold text-brand-green">{name}</span>

                <div className="mt-auto flex items-end justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-medium tracking-wide text-brand-muted-green uppercase">Precio</span>
                        <span className="text-base leading-tight font-bold text-brand-accent-brown">{formatCurrency(price)}</span>
                    </div>
                    <button
                        onClick={addToCart}
                        disabled={loading || added}
                        className={[
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                            added ? 'scale-95 bg-emerald-500 text-white' : 'bg-brand-green text-white active:scale-90',
                            loading || added ? 'opacity-80' : '',
                        ].join(' ')}
                    >
                        {added ? (
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                        ) : loading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                            <Plus className="h-4 w-4" strokeWidth={2.5} />
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
}
