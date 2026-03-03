import { Link, router } from '@inertiajs/react';
import { Check, Plus } from 'lucide-react';
import { useState } from 'react';

import { formatCurrency } from '@/lib/format';

interface CatalogProductListCardProps {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    sku?: string;
}

/**
 * Horizontal product card for list view, following the CartItemCard layout pattern.
 */
export function CatalogProductListCard({ id, name, category, price, image, sku }: CatalogProductListCardProps) {
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
            className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/[0.06] transition-shadow duration-200 active:shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
        >
            {/* Image */}
            <div className="bg-brand-cream h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <img src={image} alt={name} className="h-full w-full object-cover" />
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <span className="text-brand-muted-text text-[10px] font-medium uppercase tracking-wide">{category}</span>
                    <span className="text-brand-green line-clamp-2 text-[13px] font-semibold leading-tight">{name}</span>
                    {sku && <span className="text-brand-muted-text text-[11px]">SKU: {sku}</span>}
                </div>

                <div className="flex items-end justify-between">
                    <span className="text-brand-accent-brown text-sm font-bold">{formatCurrency(price)}</span>
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
