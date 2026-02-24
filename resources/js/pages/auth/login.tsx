import { Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

import { TextInput } from '@/components/form/TextInput';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        email: '',
        password: '',
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        form.post('/login');
    }

    return (
        <div className="mx-auto w-full max-w-md px-6 py-6">
            <h1 className="text-brand-green text-2xl font-bold">Iniciar Sesión</h1>
            <p className="text-brand-muted-green mt-1 text-sm">Ingresa a tu cuenta profesional</p>

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
                    label="Contraseña"
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

                <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-brand-accent-brown text-sm font-semibold">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={form.processing}
                    className="bg-brand-green flex h-14 items-center justify-center rounded-2xl font-bold text-white disabled:opacity-70"
                >
                    {form.processing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Iniciar Sesión'}
                </button>

                <p className="text-brand-muted-green py-4 text-center text-sm">
                    ¿No tienes cuenta?{' '}
                    <Link href="/register" className="text-brand-accent-brown font-bold">
                        Regístrate
                    </Link>
                </p>
            </form>
        </div>
    );
}
