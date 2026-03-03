import { Head, InfiniteScroll, Link, router } from '@inertiajs/react';
import { ChevronDown, ClipboardList, Loader2, MapPin, Package, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { formatCurrency } from '@/lib/format';
import type { Order, PaginatedOrders } from '@/types/order';

interface OrdersProps {
    orders: PaginatedOrders;
    ordersTotal: number;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    pending: { label: 'Pendiente', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
    processing: { label: 'En Proceso', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
    shipped: { label: 'Enviado', bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
    delivered: { label: 'Entregado', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
    cancelled: { label: 'Cancelado', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
    paid: { label: 'Pagado', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
};

function getStatus(status: string) {
    return statusConfig[status] ?? { label: status, bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' };
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function OrderCard({ order }: { order: Order }) {
    const [expanded, setExpanded] = useState(false);
    const [reordering, setReordering] = useState(false);
    const status = getStatus(order.status);
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = order.total_amount - order.shipping_cost;

    function handleReorder() {
        router.post(
            `/orders/${order.id}/reorder`,
            {},
            {
                onStart: () => setReordering(true),
                onFinish: () => setReordering(false),
            },
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06]">
            {/* Card Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="active:bg-brand-cream flex w-full items-center gap-3 p-4 text-left transition-colors"
            >
                <div className="bg-brand-icon-bg-green flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <Package className="text-brand-green h-5 w-5" />
                </div>

                <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <span className="text-brand-green text-sm font-bold">Pedido #{order.id}</span>
                        <span className="text-brand-accent-brown text-base font-bold">{formatCurrency(order.total_amount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="text-brand-muted-text text-xs">{formatDate(order.created_at)}</span>
                            <span className="text-brand-muted-text text-xs">&middot;</span>
                            <span className="text-brand-muted-text text-xs">
                                {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                            </span>
                        </div>
                        <div className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 ${status.bg}`}>
                            <div className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                            <span className={`text-[11px] font-semibold ${status.text}`}>{status.label}</span>
                        </div>
                    </div>
                </div>

                <ChevronDown
                    className={`text-brand-muted-green h-4 w-4 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Expandable Details */}
            <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="border-t border-black/[0.06] px-4 pb-4">
                        {/* Items */}
                        <div className="flex flex-col gap-2 pt-3">
                            <span className="text-brand-green text-xs font-bold uppercase tracking-wide">Productos</span>
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-brand-light-green text-brand-green flex h-5 min-w-5 items-center justify-center rounded text-[10px] font-bold">
                                            {item.quantity}
                                        </span>
                                        <span className="text-brand-green text-sm">{item.product_name}</span>
                                    </div>
                                    <span className="text-brand-green text-sm font-medium">{formatCurrency(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Shipping Address */}
                        {order.shipping_address && (
                            <div className="bg-brand-cream mt-3 flex items-start gap-2.5 rounded-xl p-3">
                                <MapPin className="text-brand-muted-green mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-brand-green text-xs font-semibold">{order.shipping_address.street}</span>
                                    <span className="text-brand-muted-text text-xs">
                                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Totals */}
                        <div className="mt-3 flex flex-col gap-1.5 border-t border-black/[0.06] pt-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-brand-muted-text">Subtotal</span>
                                <span className="text-brand-green font-medium">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-brand-muted-text">Envío</span>
                                <span className="text-brand-green font-medium">{formatCurrency(order.shipping_cost)}</span>
                            </div>
                            <div className="flex justify-between border-t border-black/[0.06] pt-1.5">
                                <span className="text-brand-green text-sm font-bold">Total</span>
                                <span className="text-brand-accent-brown text-sm font-bold">{formatCurrency(order.total_amount)}</span>
                            </div>
                        </div>

                        {/* Reorder Button */}
                        <button
                            onClick={handleReorder}
                            disabled={reordering}
                            className="bg-brand-green mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                        >
                            {reordering ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            Volver a Pedir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrdersIndex({ orders, ordersTotal }: OrdersProps) {
    const isEmpty = orders.data.length === 0;

    return (
        <>
            <Head title="Mis Pedidos" />

            <div className="flex items-center justify-between px-6 pb-4 pt-6">
                <h1 className="text-brand-green text-xl font-bold">Mis Pedidos</h1>
                {!isEmpty && (
                    <span className="bg-brand-green flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold text-white">
                        {ordersTotal}
                    </span>
                )}
            </div>

            {isEmpty ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16">
                    <div className="bg-brand-icon-bg-green flex h-20 w-20 items-center justify-center rounded-full">
                        <ClipboardList className="text-brand-green h-10 w-10" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <h2 className="text-brand-green text-xl font-bold">Sin pedidos aún</h2>
                        <p className="text-brand-muted-text text-center text-sm">Cuando realices tu primer pedido, aparecerá aquí.</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Link
                            href="/dashboard"
                            className="text-brand-green rounded-xl bg-white px-5 py-2.5 text-[13px] font-semibold shadow-sm ring-1 ring-black/[0.06]"
                        >
                            Ir al Inicio
                        </Link>
                        <Link href="/catalog" className="bg-brand-green rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white">
                            Ver Catálogo
                        </Link>
                    </div>
                </div>
            ) : (
                <InfiniteScroll
                    data="orders"
                    preserveUrl
                    onlyNext
                    loading={
                        <div className="flex justify-center py-4">
                            <Loader2 className="text-brand-muted-green h-6 w-6 animate-spin" />
                        </div>
                    }
                >
                    <div className="flex flex-col gap-3 px-6 pb-6">
                        {orders.data.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                </InfiniteScroll>
            )}
        </>
    );
}
