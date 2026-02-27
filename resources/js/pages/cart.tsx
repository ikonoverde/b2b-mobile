import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertTriangle, Info, ShoppingCart, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { CartItemCard } from '@/components/cart/CartItemCard';
import { formatCurrency } from '@/lib/format';
import type { Cart } from '@/types/cart';

interface CartPageProps {
    cart: Cart;
}

export default function CartPage({ cart }: CartPageProps) {
    const isEmpty = cart.items.length === 0;
    const { flash } = usePage().props;
    const [showUnavailable, setShowUnavailable] = useState(true);
    const [showPriceChanges, setShowPriceChanges] = useState(true);

    function clearCart() {
        if (!confirm('¿Vaciar todo el carrito?')) return;
        router.delete('/cart', { preserveScroll: true });
    }

    return (
        <>
            <Head title="Carrito" />

            <div className="flex flex-col gap-4 px-6 pb-4 pt-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-brand-green text-xl font-bold">Mi Carrito</h1>
                    {!isEmpty && (
                        <button
                            onClick={clearCart}
                            className="text-brand-muted-text flex items-center gap-1.5 text-[13px] font-medium transition-colors active:text-red-500"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Vaciar
                        </button>
                    )}
                </div>
            </div>

            {/* Reorder Notifications */}
            {flash.reorderUnavailable && showUnavailable && (
                <div className="mx-6 mb-2 flex items-start gap-3 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-amber-800">Algunos productos no están disponibles</p>
                        <ul className="mt-1 flex flex-col gap-0.5">
                            {flash.reorderUnavailable.map((item) => (
                                <li key={item.product_id} className="text-xs text-amber-700">
                                    {item.product_name} — {item.reason}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={() => setShowUnavailable(false)} className="shrink-0 p-0.5 text-amber-400 active:text-amber-600">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {flash.reorderPriceChanges && showPriceChanges && (
                <div className="mx-6 mb-2 flex items-start gap-3 rounded-xl bg-blue-50 p-3 ring-1 ring-blue-200">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-blue-800">Algunos precios han cambiado</p>
                        <ul className="mt-1 flex flex-col gap-0.5">
                            {flash.reorderPriceChanges.map((item) => (
                                <li key={item.product_id} className="text-xs text-blue-700">
                                    {item.product_name}: {formatCurrency(item.original_price)} → {formatCurrency(item.current_price)}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={() => setShowPriceChanges(false)} className="shrink-0 p-0.5 text-blue-400 active:text-blue-600">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {isEmpty ? (
                <div className="flex flex-col items-center gap-4 px-6 py-12">
                    <div className="bg-brand-icon-bg-green flex h-16 w-16 items-center justify-center rounded-full">
                        <ShoppingCart className="text-brand-green h-8 w-8" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-brand-green text-base font-semibold">Carrito vacío</span>
                        <span className="text-brand-muted-text text-sm">Agrega productos desde el catálogo</span>
                    </div>
                    <Link href="/catalog" className="bg-brand-green rounded-xl px-6 py-2.5 text-[13px] font-semibold text-white">
                        Explorar Catálogo
                    </Link>
                </div>
            ) : (
                <>
                    {/* Cart Items */}
                    <div className="flex flex-col gap-3 px-6">
                        {cart.items.map((item) => (
                            <CartItemCard key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mx-6 mt-4 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06]">
                        <h2 className="text-brand-green text-sm font-bold">Resumen del Pedido</h2>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-brand-muted-text">Subtotal</span>
                                <span className="text-brand-green font-medium">{formatCurrency(cart.totals.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-brand-muted-text">Envío</span>
                                <span className="text-brand-green font-medium">{formatCurrency(cart.totals.shipping)}</span>
                            </div>
                            <div className="border-t border-black/[0.06] pt-2">
                                <div className="flex justify-between">
                                    <span className="text-brand-green text-sm font-bold">Total</span>
                                    <span className="text-brand-accent-brown text-base font-bold">{formatCurrency(cart.totals.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Spacer for fixed button */}
                    <div className="h-24" />

                    {/* Fixed Bottom CTA */}
                    <div className="fixed inset-x-0 bottom-0 border-t border-black/[0.06] bg-white/95 px-6 py-4 backdrop-blur-sm">
                        <Link
                            href="/checkout"
                            className="bg-brand-green flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-bold text-white transition-all duration-200 active:scale-[0.98]"
                        >
                            Realizar Pedido
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}
