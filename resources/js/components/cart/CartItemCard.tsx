import { router } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { formatCurrency } from '@/lib/format';
import type { CartItem } from '@/types/cart';

interface CartItemCardProps {
    item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
    const [updating, setUpdating] = useState(false);

    function updateQuantity(quantity: number) {
        router.put(
            `/cart/items/${item.id}`,
            { quantity },
            {
                preserveScroll: true,
                preserveState: true,
                onStart: () => setUpdating(true),
                onFinish: () => setUpdating(false),
            },
        );
    }

    function removeItem() {
        if (!confirm('¿Eliminar este producto del carrito?')) return;

        router.delete(`/cart/items/${item.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <div className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/[0.06]">
            {/* Image */}
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-cream">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                    <span className="line-clamp-2 text-[13px] font-semibold leading-tight text-brand-green">
                        {item.name}
                    </span>
                    <button
                        onClick={removeItem}
                        className="shrink-0 rounded-lg p-1.5 text-brand-muted-text transition-colors active:bg-red-50 active:text-red-500"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-end justify-between">
                    <span className="text-sm font-bold text-brand-accent-brown">
                        {formatCurrency(item.subtotal)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateQuantity(item.quantity - 1)}
                            disabled={updating || item.quantity <= 1}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-cream transition-colors disabled:opacity-40"
                        >
                            <Minus className="h-3.5 w-3.5 text-brand-green" />
                        </button>
                        <span className="min-w-[2ch] text-center text-sm font-bold text-brand-green">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.quantity + 1)}
                            disabled={updating}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-cream transition-colors disabled:opacity-40"
                        >
                            <Plus className="h-3.5 w-3.5 text-brand-green" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
