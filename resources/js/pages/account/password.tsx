import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, KeyRound, Loader2, Lock, ShieldCheck } from 'lucide-react';

import { TextInput } from '@/components/form/TextInput';

export default function Password() {
    const { errors: pageErrors } = usePage<{ errors: Record<string, string>; [key: string]: unknown }>().props;

    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.put('/account/password', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <>
            <Head title="Cambiar Contraseña" />

            {/* Header */}
            <div className="flex items-center gap-3 px-6 pb-4 pt-6">
                <button
                    onClick={() => router.visit('/account')}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06]"
                >
                    <ArrowLeft className="text-brand-green h-5 w-5" />
                </button>
                <h1 className="text-brand-green text-lg font-bold">Cambiar Contraseña</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 px-6 pb-6">
                {pageErrors.password && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{pageErrors.password}</div>}

                <TextInput
                    label="Contraseña actual"
                    icon={Lock}
                    type="password"
                    placeholder="Ingresa tu contraseña actual"
                    value={form.data.current_password}
                    onChange={(e) => form.setData('current_password', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.current_password}
                />

                <TextInput
                    label="Nueva contraseña"
                    icon={KeyRound}
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.password}
                />

                <TextInput
                    label="Confirmar contraseña"
                    icon={ShieldCheck}
                    type="password"
                    placeholder="Repite la nueva contraseña"
                    value={form.data.password_confirmation}
                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.password_confirmation}
                />

                <button
                    type="submit"
                    disabled={form.processing}
                    className="bg-brand-green mt-2 flex h-14 items-center justify-center rounded-2xl font-bold text-white disabled:opacity-70"
                >
                    {form.processing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Cambiar Contraseña'}
                </button>
            </form>
        </>
    );
}
