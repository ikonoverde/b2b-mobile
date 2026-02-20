import { Link, useForm } from '@inertiajs/react';
import { Briefcase, Eye, EyeOff, FileText, Loader2, Lock, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

import { Checkbox } from '@/components/form/Checkbox';
import { TextInput } from '@/components/form/TextInput';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        name: '',
        rfc: '',
        email: '',
        phone: '',
        password: '',
        terms_accepted: false,
    });

    form.transform((data) => ({
        ...data,
        device_name: 'mobile',
    }));

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/register');
    }

    return (
        <div className="mx-auto w-full max-w-md px-6 py-6">
            <h1 className="text-2xl font-bold text-brand-green">Crear Cuenta</h1>
            <p className="mt-1 text-sm text-brand-muted-green">Completa los datos de tu negocio</p>

            <form onSubmit={submit} className="mt-6 flex flex-col gap-3.5">
                <TextInput
                    label="Nombre del Negocio"
                    icon={Briefcase}
                    placeholder="Mi Spa & Bienestar"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.name}
                />

                <TextInput
                    label="RFC de la Empresa"
                    icon={FileText}
                    placeholder="XAXX010101000"
                    value={form.data.rfc}
                    onChange={(e) => form.setData('rfc', e.target.value)}
                    autoCapitalize="characters"
                    style={{ textTransform: 'uppercase' }}
                    disabled={form.processing}
                    error={form.errors.rfc}
                />

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
                    label="Teléfono de Contacto"
                    icon={Phone}
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    value={form.data.phone}
                    onChange={(e) => form.setData('phone', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.phone}
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
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-brand-muted-green"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    }
                />

                <Checkbox
                    checked={form.data.terms_accepted}
                    onChange={(checked) => form.setData('terms_accepted', checked)}
                    disabled={form.processing}
                    error={form.errors.terms_accepted}
                >
                    Acepto los{' '}
                    <a href="/terms" className="font-semibold text-brand-accent-brown">
                        Términos y Condiciones
                    </a>{' '}
                    y la{' '}
                    <a href="/privacy" className="font-semibold text-brand-accent-brown">
                        Política de Privacidad
                    </a>
                </Checkbox>

                <button
                    type="submit"
                    disabled={form.processing}
                    className="flex h-14 items-center justify-center rounded-2xl bg-brand-green font-bold text-white disabled:opacity-70"
                >
                    {form.processing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Crear Cuenta'}
                </button>

                <p className="py-4 text-center text-sm text-brand-muted-green">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="font-bold text-brand-accent-brown">
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </div>
    );
}
