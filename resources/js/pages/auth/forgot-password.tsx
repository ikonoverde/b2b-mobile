import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle, Loader2, Mail } from 'lucide-react';

import { TextInput } from '@/components/form/TextInput';

export default function ForgotPassword() {
    const { flash } = usePage<{ flash: { status: string | null } }>().props;

    const form = useForm({
        email: '',
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        form.post('/forgot-password');
    }

    if (flash?.status === 'sent') {
        return (
            <div className="mx-auto w-full max-w-md px-6 py-6">
                <div className="flex flex-col items-center text-center">
                    <CheckCircle className="text-brand-green h-12 w-12" />
                    <h1 className="text-brand-green mt-4 text-2xl font-bold">Revisa tu correo</h1>
                    <p className="text-brand-muted-green mt-2 text-sm">
                        Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.
                    </p>
                    <Link href="/login" className="bg-brand-green mt-6 flex h-14 w-full items-center justify-center rounded-2xl font-bold text-white">
                        Volver a iniciar sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-md px-6 py-6">
            <h1 className="text-brand-green text-2xl font-bold">Recuperar Contraseña</h1>
            <p className="text-brand-muted-green mt-1 text-sm">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={submit} className="mt-6 flex flex-col gap-3.5">
                <TextInput
                    label="Correo Electrónico"
                    icon={Mail}
                    type="email"
                    placeholder="tu@email.com"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={form.processing}
                    error={form.errors.email}
                />

                <button
                    type="submit"
                    disabled={form.processing}
                    className="bg-brand-green flex h-14 items-center justify-center rounded-2xl font-bold text-white disabled:opacity-70"
                >
                    {form.processing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enviar enlace'}
                </button>

                <p className="text-brand-muted-green py-4 text-center text-sm">
                    <Link href="/login" className="text-brand-accent-brown font-bold">
                        Volver a iniciar sesión
                    </Link>
                </p>
            </form>
        </div>
    );
}
