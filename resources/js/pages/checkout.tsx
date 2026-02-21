import { Head, useForm, usePage } from '@inertiajs/react';
import { Loader2, MapPin, Phone, User } from 'lucide-react';

import { TextInput } from '@/components/form/TextInput';
import { formatCurrency } from '@/lib/format';
import type { Cart } from '@/types/cart';

interface CheckoutProps {
    cart: Cart;
}

export default function Checkout({ cart }: CheckoutProps) {
    const form = useForm({
        name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        phone: '',
    });

    const pageErrors = usePage().props.errors as Record<string, string>;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/checkout');
    }

    return (
        <>
            <Head title="Checkout" />

            <div className="flex flex-col gap-4 px-6 pt-6 pb-4">
                <h1 className="text-xl font-bold text-brand-green">Finalizar Pedido</h1>
            </div>

            {/* Order Summary */}
            <div className="mx-6 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06]">
                <h2 className="text-sm font-bold text-brand-green">Resumen ({cart.items.length} productos)</h2>
                <div className="flex flex-col gap-2">
                    {cart.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-brand-muted-text">
                                {item.name} x{item.quantity}
                            </span>
                            <span className="font-medium text-brand-green">{formatCurrency(item.subtotal)}</span>
                        </div>
                    ))}
                    <div className="border-t border-black/[0.06] pt-2">
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
                        <div className="mt-1 flex justify-between">
                            <span className="text-sm font-bold text-brand-green">Total</span>
                            <span className="text-base font-bold text-brand-accent-brown">
                                {formatCurrency(cart.totals.total)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Form */}
            <form onSubmit={submit} className="flex flex-col gap-3.5 px-6 pt-5 pb-6">
                <h2 className="text-sm font-bold text-brand-green">Dirección de Envío</h2>

                <TextInput
                    label="Nombre de contacto"
                    icon={User}
                    placeholder="Nombre completo"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.name}
                />

                <TextInput
                    label="Dirección"
                    icon={MapPin}
                    placeholder="Calle y número"
                    value={form.data.address_line_1}
                    onChange={(e) => form.setData('address_line_1', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.address_line_1}
                />

                <TextInput
                    label="Dirección línea 2 (opcional)"
                    icon={MapPin}
                    placeholder="Interior, colonia, etc."
                    value={form.data.address_line_2}
                    onChange={(e) => form.setData('address_line_2', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.address_line_2}
                />

                <div className="grid grid-cols-2 gap-3">
                    <TextInput
                        label="Ciudad"
                        placeholder="Ciudad"
                        value={form.data.city}
                        onChange={(e) => form.setData('city', e.target.value)}
                        disabled={form.processing}
                        error={form.errors.city}
                    />
                    <TextInput
                        label="Estado"
                        placeholder="Estado"
                        value={form.data.state}
                        onChange={(e) => form.setData('state', e.target.value)}
                        disabled={form.processing}
                        error={form.errors.state}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <TextInput
                        label="Código Postal"
                        placeholder="00000"
                        value={form.data.postal_code}
                        onChange={(e) => form.setData('postal_code', e.target.value)}
                        disabled={form.processing}
                        error={form.errors.postal_code}
                    />
                    <TextInput
                        label="Teléfono"
                        icon={Phone}
                        type="tel"
                        placeholder="10 dígitos"
                        value={form.data.phone}
                        onChange={(e) => form.setData('phone', e.target.value)}
                        disabled={form.processing}
                        error={form.errors.phone}
                    />
                </div>

                {pageErrors.checkout && (
                    <p className="text-sm font-medium text-red-500">{pageErrors.checkout}</p>
                )}

                <button
                    type="submit"
                    disabled={form.processing}
                    className="flex h-14 items-center justify-center rounded-2xl bg-brand-green font-bold text-white disabled:opacity-70"
                >
                    {form.processing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirmar Pedido'}
                </button>
            </form>
        </>
    );
}
