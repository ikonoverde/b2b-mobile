import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Check, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ImageGallery } from '@/components/products/ImageGallery';
import { ImageModal } from '@/components/products/ImageModal';
import { PricingTiers } from '@/components/products/PricingTiers';
import { formatCurrency } from '@/lib/format';
import type { Category, ProductImage } from '@/types';

interface PricingTier {
    min_quantity: number;
    max_quantity: number | null;
    price: number;
}

interface Product {
    id: number;
    name: string;
    category: Category;
    price: number;
    image: string;
    description?: string;
    sku?: string;
    size?: string;
    pricing_tiers?: PricingTier[];
    images?: ProductImage[];
}

interface ProductShowProps {
    product: Product;
}

export default function ProductShow({ product }: ProductShowProps) {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const images: ProductImage[] = useMemo(
        () => (product.images?.length ? product.images : [{ id: 0, url: product.image, position: 0 }]),
        [product.images, product.image],
    );

    const activeTier = useMemo(() => {
        if (!product.pricing_tiers?.length) return null;

        return product.pricing_tiers.find((tier) => quantity >= tier.min_quantity && (tier.max_quantity === null || quantity <= tier.max_quantity));
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
                    <ArrowLeft className="text-brand-green h-5 w-5" />
                </button>
            </div>

            {/* Product Image Gallery */}
            <ImageGallery
                images={images}
                productName={product.name}
                onImageTap={(index) => {
                    setModalIndex(index);
                    setModalOpen(true);
                }}
            />

            {/* Product Info */}
            <div className="flex flex-col gap-1 px-6 pt-5">
                <span className="text-brand-muted-green text-[11px] font-semibold uppercase tracking-wide">{product.category.name}</span>
                <h1 className="text-brand-green text-xl font-bold">{product.name}</h1>
                {product.size && <p className="text-brand-muted-text text-sm">{product.size}</p>}
                {product.description && <p className="text-brand-muted-text mt-1 text-sm leading-relaxed">{product.description}</p>}
            </div>

            {/* Pricing Tiers */}
            {product.pricing_tiers && product.pricing_tiers.length > 0 && <PricingTiers tiers={product.pricing_tiers} activeTier={activeTier} />}

            {/* Quantity Selector */}
            <div className="flex flex-col gap-3 px-6 pt-5">
                <h2 className="text-brand-green text-sm font-bold">Cantidad</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={decrement}
                        disabled={quantity <= 1}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06] transition-colors disabled:opacity-40"
                    >
                        <Minus className="text-brand-green h-4 w-4" />
                    </button>
                    <span className="text-brand-green min-w-[3ch] text-center text-lg font-bold">{quantity}</span>
                    <button
                        onClick={increment}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06] transition-colors"
                    >
                        <Plus className="text-brand-green h-4 w-4" />
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

            {/* Fullscreen Image Modal */}
            {modalOpen && <ImageModal images={images} initialIndex={modalIndex} onClose={() => setModalOpen(false)} />}
        </>
    );
}
