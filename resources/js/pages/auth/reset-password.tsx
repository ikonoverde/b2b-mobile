import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle, Eye, EyeOff, KeyRound, Loader2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

import { TextInput } from '@/components/form/TextInput';

export default function ResetPassword() {
    const { flash } = usePage<{ flash: { status: string | null } }>().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const form = useForm({
        email: '',
        token: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        form.post('/reset-password');
    }

    // Show success state after password reset
    if (flash?.status === 'password-reset') {
        return (
            <div className="mx-auto w-full max-w-md px-6 py-6">
                <div className="flex flex-col items-center text-center">
                    <CheckCircle className="h-12 w-12 text-brand-green" />
                    <h1 className="mt-4 text-2xl font-bold text-brand-green">¡Contraseña actualizada!</h1>
                    <p className="mt-2 text-sm text-brand-muted-green">
                        Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.
                    </p>
                    <Link href="/login" className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-brand-green font-bold text-white">
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-md px-6 py-6">
            <h1 className="text-2xl font-bold text-brand-green">Restablecer Contraseña</h1>
            <p className="mt-1 text-sm text-brand-muted-green">Ingresa el código de restablecimiento y tu nueva contraseña.</p>

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

                <TextInput
                    label="Código de Restablecimiento"
                    icon={KeyRound}
                    type="text"
                    placeholder="Ingresa el código recibido"
                    value={form.data.token}
                    onChange={(e) => form.setData('token', e.target.value)}
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={form.processing}
                    error={form.errors.token}
                />

                <TextInput
                    label="Nueva Contraseña"
                    icon={Lock}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.password}
                    rightElement={
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-brand-muted-green" tabIndex={-1}>
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    }
                />

                <TextInput
                    label="Confirmar Contraseña"
                    icon={Lock}
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.data.password_confirmation}
                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.password_confirmation}
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            className="text-brand-muted-green"
                            tabIndex={-1}
                        >
                            {showPasswordConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    }
                />

                <button
                    type="submit"
                    disabled={form.processing}
                    className="flex h-14 items-center justify-center rounded-2xl bg-brand-green font-bold text-white disabled:opacity-70"
                >
                    {form.processing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Restablecer Contraseña'}
                </button>

                <p className="py-4 text-center text-sm text-brand-muted-green">
                    ¿No tienes un código?{' '}
                    <Link href="/forgot-password" className="font-bold text-brand-accent-brown">
                        Solicitar nuevo código
                    </Link>
                </p>
            </form>
        </div>
    );
}
