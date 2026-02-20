import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Check, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';

import { formatCurrency } from '@/lib/format';

interface PricingTier {
    min_quantity: number;
    max_quantity: number | null;
    price: number;
}

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    description?: string;
    sku?: string;
    size?: string;
    pricing_tiers?: PricingTier[];
}

interface ProductShowProps {
    product: Product;
}

export default function ProductShow({ product }: ProductShowProps) {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);

    const activeTier = useMemo(() => {
        if (!product.pricing_tiers?.length) return null;

        return product.pricing_tiers.find(
            (tier) => quantity >= tier.min_quantity && (tier.max_quantity === null || quantity <= tier.max_quantity),
        );
    }, [product.pricing_tiers, quantity]);

    const unitPrice = activeTier?.price ?? product.price;
    const totalPrice = unitPrice * quantity;

    function decrement() {
        setQuantity((q) => Math.max(1, q - 1));
    }

    function increment() {
        setQuantity((q) => q + 1);
    }

    function addToCart() {
        router.post(
            '/cart/items',
            { product_id: product.id, quantity },
            {
                preserveScroll: true,
                preserveState: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
                onSuccess: () => {
                    setAdded(true);
                    setTimeout(() => setAdded(false), 2000);
                },
            },
        );
    }

    return (
        <>
            <Head title={product.name} />

            {/* Back button */}
            <div className="px-4 pt-4">
                <button
                    onClick={() => window.history.back()}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06]"
                >
                    <ArrowLeft className="h-5 w-5 text-brand-green" />
                </button>
            </div>

            {/* Product Image */}
            <div className="mx-6 mt-3 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06]">
                <div className="aspect-square overflow-hidden bg-brand-cream">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-1 px-6 pt-5">
                <span className="text-[11px] font-semibold tracking-wide text-brand-muted-green uppercase">
                    {product.category}
                </span>
                <h1 className="text-xl font-bold text-brand-green">{product.name}</h1>
                {product.size && <p className="text-sm text-brand-muted-text">{product.size}</p>}
                {product.description && <p className="mt-1 text-sm leading-relaxed text-brand-muted-text">{product.description}</p>}
            </div>

            {/* Pricing Tiers */}
            {product.pricing_tiers && product.pricing_tiers.length > 0 && (
                <div className="flex flex-col gap-3 px-6 pt-5">
                    <h2 className="text-sm font-bold text-brand-green">Precios por Volumen</h2>
                    <div className="flex flex-col gap-2">
                        {product.pricing_tiers.map((tier, idx) => {
                            const isActive = activeTier === tier;
                            return (
                                <div
                                    key={idx}
                                    className={[
                                        'flex items-center justify-between rounded-xl px-4 py-3 transition-colors duration-200',
                                        isActive
                                            ? 'bg-brand-green/10 ring-1 ring-brand-green/30'
                                            : 'bg-white ring-1 ring-black/[0.06]',
                                    ].join(' ')}
                                >
                                    <div className="flex flex-col">
                                        <span
                                            className={[
                                                'text-[13px] font-semibold',
                                                isActive ? 'text-brand-green' : 'text-brand-muted-text',
                                            ].join(' ')}
                                        >
                                            {tier.max_quantity
                                                ? `${tier.min_quantity} – ${tier.max_quantity} unidades`
                                                : `${tier.min_quantity}+ unidades`}
                                        </span>
                                    </div>
                                    <span
                                        className={[
                                            'text-base font-bold',
                                            isActive ? 'text-brand-accent-brown' : 'text-brand-muted-text',
                                        ].join(' ')}
                                    >
                                        {formatCurrency(tier.price)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Quantity Selector */}
            <div className="flex flex-col gap-3 px-6 pt-5">
                <h2 className="text-sm font-bold text-brand-green">Cantidad</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={decrement}
                        disabled={quantity <= 1}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06] transition-colors disabled:opacity-40"
                    >
                        <Minus className="h-4 w-4 text-brand-green" />
                    </button>
                    <span className="min-w-[3ch] text-center text-lg font-bold text-brand-green">{quantity}</span>
                    <button
                        onClick={increment}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06] transition-colors"
                    >
                        <Plus className="h-4 w-4 text-brand-green" />
                    </button>
                </div>
            </div>

            {/* Spacer for fixed bottom button */}
            <div className="h-24" />

            {/* Fixed Bottom CTA */}
            <div className="fixed inset-x-0 bottom-0 border-t border-black/[0.06] bg-white/95 px-6 py-4 backdrop-blur-sm">
                <button
                    onClick={addToCart}
                    disabled={loading || added}
                    className={[
                        'flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-bold text-white transition-all duration-200',
                        added ? 'bg-emerald-500' : 'bg-brand-green active:scale-[0.98]',
                        loading ? 'opacity-80' : '',
                    ].join(' ')}
                >
                    {added ? (
                        <>
                            <Check className="h-5 w-5" strokeWidth={2.5} />
                            <span>Agregado al Pedido</span>
                        </>
                    ) : loading ? (
                        <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            <span>Agregando...</span>
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-5 w-5" />
                            <span>Agregar al Pedido – {formatCurrency(totalPrice)}</span>
                        </>
                    )}
                </button>
            </div>
        </>
    );
}
