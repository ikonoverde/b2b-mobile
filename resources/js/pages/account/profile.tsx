import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Loader2, Mail, Phone } from 'lucide-react';

import { TextInput } from '@/components/form/TextInput';
import type { Auth } from '@/types/auth';

export default function Profile() {
    const { auth, errors: pageErrors } = usePage<{ auth: Auth; errors: Record<string, string>; [key: string]: unknown }>().props;
    const user = auth.user!;

    const form = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.put('/account/profile', {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Editar Perfil" />

            {/* Header */}
            <div className="flex items-center gap-3 px-6 pb-4 pt-6">
                <button
                    onClick={() => router.visit('/account')}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06]"
                >
                    <ArrowLeft className="text-brand-green h-5 w-5" />
                </button>
                <h1 className="text-brand-green text-lg font-bold">Editar Perfil</h1>
            </div>

            {/* RFC read-only card */}
            {user.rfc && (
                <div className="px-6 pb-4">
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06]">
                        <span className="text-brand-muted-text text-[11px] font-medium uppercase tracking-wide">RFC</span>
                        <p className="text-brand-green text-sm font-bold">{user.rfc}</p>
                    </div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 px-6 pb-6">
                {pageErrors.profile && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{pageErrors.profile}</div>}

                <TextInput
                    label="Nombre"
                    icon={Briefcase}
                    placeholder="Nombre completo"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.name}
                />

                <TextInput
                    label="Correo electrónico"
                    icon={Mail}
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.email}
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

                <button
                    type="submit"
                    disabled={form.processing}
                    className="bg-brand-green mt-2 flex h-14 items-center justify-center rounded-2xl font-bold text-white disabled:opacity-70"
                >
                    {form.processing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Guardar Cambios'}
                </button>
            </form>
        </>
    );
}
