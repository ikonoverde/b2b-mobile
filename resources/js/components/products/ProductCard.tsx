import { router, usePage } from '@inertiajs/react';
import { Check, Lock, Plus } from 'lucide-react';
import { useState } from 'react';

import { formatCurrency } from '@/lib/format';
import { Auth } from '@/types/auth';

interface ProductCardProps {
    id: number;
    imageUrl: string;
    name: string;
    size: string;
    price: number;
    showPrice?: boolean;
}

export function ProductCard({ id, imageUrl, name, size, price, showPrice = true }: ProductCardProps) {
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);
    const { auth } = usePage<{ auth: Auth }>().props;

    function addToCart() {
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
        <div className="group w-44 shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03] transition-shadow duration-200 active:shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream">
                <img
                    src={imageUrl}
                    alt={name}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/10 to-transparent" />
                <span className="absolute bottom-1.5 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-brand-muted-text backdrop-blur-sm">
                    {size}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 p-3">
                <span className="line-clamp-2 text-[13px] leading-[1.3] font-semibold text-brand-green">
                    {name}
                </span>

                {showPrice ? (
                    <div className="flex items-end justify-between gap-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-medium tracking-wide text-brand-muted-green uppercase">
                                Precio
                            </span>
                            <span className="text-base leading-tight font-bold text-brand-accent-brown">
                                {formatCurrency(price)}
                            </span>
                        </div>
                        {auth.user && (
                            <button
                                onClick={addToCart}
                                disabled={loading || added}
                                className={[
                                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                                    added
                                        ? 'scale-95 bg-emerald-500 text-white'
                                        : 'bg-brand-green text-white active:scale-90',
                                    (loading || added) ? 'opacity-80' : '',
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
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => router.visit('/login')}
                        className="flex items-center gap-1.5 rounded-xl bg-brand-cream px-2.5 py-2 transition-colors duration-150 active:bg-brand-icon-bg-brown"
                    >
                        <Lock className="h-3 w-3 text-brand-accent-brown" />
                        <span className="text-[11px] font-bold text-brand-accent-brown">
                            Ver precio
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}
