import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckCircle, CreditCard, ExternalLink, Loader2, MapPin, Package, Phone, Truck, User } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { TextInput } from '@/components/form/TextInput';
import { formatCurrency } from '@/lib/format';
import type { Cart } from '@/types/cart';
import type { Order } from '@/types/order';

type Step = 'shipping' | 'payment' | 'success';

interface CheckoutProps {
    cart: Cart;
    checkoutUrl?: string;
    order?: Order;
}

const steps = [
    { key: 'shipping' as const, label: 'Envio', icon: Truck },
    { key: 'payment' as const, label: 'Pago', icon: CreditCard },
    { key: 'success' as const, label: 'Listo', icon: CheckCircle },
];

function StepIndicator({ currentStep }: { currentStep: Step }) {
    const currentIndex = steps.findIndex((s) => s.key === currentStep);

    return (
        <div className="flex items-center justify-between px-6 pb-2 pt-6">
            {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentIndex;
                const isCompleted = index < currentIndex;

                return (
                    <div key={step.key} className="flex flex-1 items-center">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                    isActive
                                        ? 'bg-brand-green text-white'
                                        : isCompleted
                                          ? 'bg-brand-green/20 text-brand-green'
                                          : 'bg-gray-100 text-gray-400'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                            </div>
                            <span
                                className={`text-xs font-medium ${
                                    isActive ? 'text-brand-green' : isCompleted ? 'text-brand-green/70' : 'text-gray-400'
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`mx-2 h-0.5 flex-1 rounded ${isCompleted ? 'bg-brand-green/30' : 'bg-gray-100'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function OrderSummary({ cart }: { cart: Cart }) {
    return (
        <div className="mx-6 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06]">
            <h2 className="text-brand-green text-sm font-bold">Resumen ({cart.items.length} productos)</h2>
            <div className="flex flex-col gap-2">
                {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-brand-muted-text">
                            {item.name} x{item.quantity}
                        </span>
                        <span className="text-brand-green font-medium">{formatCurrency(item.subtotal)}</span>
                    </div>
                ))}
                <div className="border-t border-black/[0.06] pt-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-brand-muted-text">Subtotal</span>
                        <span className="text-brand-green font-medium">{formatCurrency(cart.totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-brand-muted-text">Envio</span>
                        <span className="text-brand-green font-medium">{formatCurrency(cart.totals.shipping)}</span>
                    </div>
                    <div className="mt-1 flex justify-between">
                        <span className="text-brand-green text-sm font-bold">Total</span>
                        <span className="text-brand-accent-brown text-base font-bold">{formatCurrency(cart.totals.total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PaymentPending({ checkoutUrl, onPaid }: { checkoutUrl: string; onPaid: () => void }) {
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const pollStatus = useCallback(async () => {
        try {
            const response = await fetch('/checkout/status', {
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) return;

            const data = await response.json();

            if (data.status === 'paid') {
                if (pollingRef.current) {
                    clearInterval(pollingRef.current);
                    pollingRef.current = null;
                }
                onPaid();
            }
        } catch {
            // Silently retry on network errors
        }
    }, [onPaid]);

    useEffect(() => {
        pollingRef.current = setInterval(pollStatus, 3000);

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, [pollStatus]);

    return (
        <div className="flex flex-col gap-4 px-6 pb-6 pt-5">
            <h2 className="text-brand-green text-sm font-bold">Pago</h2>

            <a
                href={checkoutUrl}
                className="bg-brand-green flex h-14 items-center justify-center gap-2 rounded-2xl font-bold text-white"
            >
                <ExternalLink className="h-5 w-5" />
                Pagar con Stripe
            </a>

            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.06]">
                <Loader2 className="text-brand-green h-8 w-8 animate-spin" />
                <p className="text-brand-muted-text text-center text-sm">Esperando confirmacion de pago...</p>
                <p className="text-brand-muted-text/70 text-center text-xs">
                    Completa el pago en tu navegador. Esta pagina se actualizara automaticamente.
                </p>
            </div>
        </div>
    );
}

function SuccessStep() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16">
            <div className="bg-brand-green/10 flex h-20 w-20 items-center justify-center rounded-full">
                <CheckCircle className="text-brand-green h-10 w-10" />
            </div>
            <h2 className="text-brand-green text-xl font-bold">Pago Exitoso</h2>
            <p className="text-brand-muted-text text-center text-sm">Tu pedido ha sido confirmado. Puedes seguir el estado en tus pedidos.</p>
            <a href="/orders" className="bg-brand-green mt-4 flex h-14 w-full items-center justify-center rounded-2xl font-bold text-white">
                <Package className="mr-2 h-5 w-5" />
                Ver Mis Pedidos
            </a>
        </div>
    );
}

export default function Checkout({ cart, checkoutUrl }: CheckoutProps) {
    const [step, setStep] = useState<Step>('shipping');

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

    useEffect(() => {
        if (checkoutUrl) {
            setStep('payment');
        }
    }, [checkoutUrl]);

    function submitShipping(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        form.post('/checkout');
    }

    return (
        <>
            <Head title="Checkout" />

            <StepIndicator currentStep={step} />

            {step !== 'success' && <OrderSummary cart={cart} />}

            {step === 'shipping' && (
                <form onSubmit={submitShipping} className="flex flex-col gap-3.5 px-6 pb-6 pt-5">
                    <h2 className="text-brand-green text-sm font-bold">Direccion de Envio</h2>

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
                        label="Direccion"
                        icon={MapPin}
                        placeholder="Calle y numero"
                        value={form.data.address_line_1}
                        onChange={(e) => form.setData('address_line_1', e.target.value)}
                        disabled={form.processing}
                        error={form.errors.address_line_1}
                    />

                    <TextInput
                        label="Direccion linea 2 (opcional)"
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
                            label="Codigo Postal"
                            placeholder="00000"
                            value={form.data.postal_code}
                            onChange={(e) => form.setData('postal_code', e.target.value)}
                            disabled={form.processing}
                            error={form.errors.postal_code}
                        />
                        <TextInput
                            label="Telefono"
                            icon={Phone}
                            type="tel"
                            placeholder="10 digitos"
                            value={form.data.phone}
                            onChange={(e) => form.setData('phone', e.target.value)}
                            disabled={form.processing}
                            error={form.errors.phone}
                        />
                    </div>

                    {pageErrors.checkout && <p className="text-sm font-medium text-red-500">{pageErrors.checkout}</p>}

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="bg-brand-green flex h-14 items-center justify-center rounded-2xl font-bold text-white disabled:opacity-70"
                    >
                        {form.processing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Continuar al Pago'}
                    </button>
                </form>
            )}

            {step === 'payment' && checkoutUrl && (
                <PaymentPending checkoutUrl={checkoutUrl} onPaid={() => setStep('success')} />
            )}

            {step === 'success' && <SuccessStep />}
        </>
    );
}
