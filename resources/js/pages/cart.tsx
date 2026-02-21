import { Head, Link, router } from '@inertiajs/react';
import { ShoppingCart, Trash2 } from 'lucide-react';

import { CartItemCard } from '@/components/cart/CartItemCard';
import { formatCurrency } from '@/lib/format';
import type { Cart } from '@/types/cart';

interface CartPageProps {
    cart: Cart;
}

export default function CartPage({ cart }: CartPageProps) {
    const isEmpty = cart.items.length === 0;

    function clearCart() {
        if (!confirm('¿Vaciar todo el carrito?')) return;
        router.delete('/cart', { preserveScroll: true });
    }

    return (
        <>
            <Head title="Carrito" />

            <div className="flex flex-col gap-4 px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-brand-green">Mi Carrito</h1>
                    {!isEmpty && (
                        <button
                            onClick={clearCart}
                            className="flex items-center gap-1.5 text-[13px] font-medium text-brand-muted-text transition-colors active:text-red-500"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Vaciar
                        </button>
                    )}
                </div>
            </div>

            {isEmpty ? (
                <div className="flex flex-col items-center gap-4 px-6 py-12">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-icon-bg-green">
                        <ShoppingCart className="h-8 w-8 text-brand-green" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-base font-semibold text-brand-green">Carrito vacío</span>
                        <span className="text-sm text-brand-muted-text">Agrega productos desde el catálogo</span>
                    </div>
                    <Link
                        href="/catalog"
                        className="rounded-xl bg-brand-green px-6 py-2.5 text-[13px] font-semibold text-white"
                    >
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
                        <h2 className="text-sm font-bold text-brand-green">Resumen del Pedido</h2>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-brand-muted-text">Subtotal</span>
                                <span className="font-medium text-brand-green">
                                    {formatCurrency(cart.totals.subtotal)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-brand-muted-text">Envío</span>
                                <span className="font-medium text-brand-green">
                                    {formatCurrency(cart.totals.shipping)}
                                </span>
                            </div>
                            <div className="border-t border-black/[0.06] pt-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-bold text-brand-green">Total</span>
                                    <span className="text-base font-bold text-brand-accent-brown">
                                        {formatCurrency(cart.totals.total)}
                                    </span>
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
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-green px-6 py-3.5 text-[15px] font-bold text-white transition-all duration-200 active:scale-[0.98]"
                        >
                            Realizar Pedido
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}
