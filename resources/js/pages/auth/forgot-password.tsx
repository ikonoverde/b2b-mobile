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
                    <CheckCircle className="h-12 w-12 text-brand-green" />
                    <h1 className="mt-4 text-2xl font-bold text-brand-green">Revisa tu correo</h1>
                    <p className="mt-2 text-sm text-brand-muted-green">
                        Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.
                    </p>
                    <Link href="/login" className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-brand-green font-bold text-white">
                        Volver a iniciar sesión
                    </Link>
                    <p className="mt-4 text-center text-sm text-brand-muted-green">
                        ¿Ya tienes un código?{' '}
                        <Link href="/reset-password" className="font-bold text-brand-accent-brown">
                            Ingresar código
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-md px-6 py-6">
            <h1 className="text-2xl font-bold text-brand-green">Recuperar Contraseña</h1>
            <p className="mt-1 text-sm text-brand-muted-green">
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
                    className="flex h-14 items-center justify-center rounded-2xl bg-brand-green font-bold text-white disabled:opacity-70"
                >
                    {form.processing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enviar enlace'}
                </button>

                <p className="py-4 text-center text-sm text-brand-muted-green">
                    <Link href="/login" className="font-bold text-brand-accent-brown">
                        Volver a iniciar sesión
                    </Link>
                </p>
            </form>
        </div>
    );
}
