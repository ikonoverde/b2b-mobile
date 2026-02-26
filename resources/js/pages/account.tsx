import { Head, router, usePage } from '@inertiajs/react';
import { Building2, ChevronRight, CreditCard, Headphones, Lock, LogOut, MapPin, Package, Percent, UserPen, Users } from 'lucide-react';

import type { Auth } from '@/types/auth';

interface Profile {
    orders_count?: number;
    total_spent?: number;
    discount_percentage?: number;
}

interface AccountProps {
    profile: Profile;
}

export default function Account({ profile }: AccountProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth.user!;

    const initials = user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    function logout() {
        router.post('/logout');
    }

    const menuItems = [
        { icon: UserPen, label: 'Editar Perfil', href: '/account/profile' },
        { icon: Lock, label: 'Cambiar Contraseña', href: '/account/password' },
        { icon: CreditCard, label: 'Datos de Facturación', href: '#' },
        { icon: MapPin, label: 'Direcciones de Envío', href: '/account/addresses' },
        { icon: Users, label: 'Usuarios Autorizados', href: '#' },
        { icon: Headphones, label: 'Soporte Comercial', href: '#' },
    ];

    return (
        <>
            <Head title="Mi Cuenta" />

            {/* Profile Header */}
            <div className="flex flex-col items-center gap-3 px-6 pb-4 pt-6">
                <div className="bg-brand-green flex h-20 w-20 items-center justify-center rounded-full">
                    <span className="text-2xl font-bold text-white">{initials}</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-brand-green text-lg font-bold">{user.name}</span>
                    {user.rfc && <span className="text-brand-muted-green text-[11px] font-medium uppercase tracking-wide">RFC: {user.rfc}</span>}
                    <span className="text-brand-muted-text text-sm">{user.email}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="flex gap-2 px-6">
                <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/[0.06]">
                    <Package className="text-brand-green h-5 w-5" />
                    <span className="text-brand-green text-lg font-bold">{profile.orders_count ?? 0}</span>
                    <span className="text-brand-muted-text text-[10px] font-medium">Pedidos</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/[0.06]">
                    <Building2 className="text-brand-accent-brown h-5 w-5" />
                    <span className="text-brand-accent-brown text-lg font-bold">{profile.total_spent ?? 0}</span>
                    <span className="text-brand-muted-text text-[10px] font-medium">Compras</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/[0.06]">
                    <Percent className="text-brand-green h-5 w-5" />
                    <span className="text-brand-green text-lg font-bold">{profile.discount_percentage ?? 0}%</span>
                    <span className="text-brand-muted-text text-[10px] font-medium">Descuento</span>
                </div>
            </div>

            {/* Menu */}
            <div className="flex flex-col gap-1 px-6 pt-5">
                <h2 className="text-brand-green mb-2 text-sm font-bold">Configuración</h2>
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => {
                            if (item.href !== '#') {
                                router.visit(item.href);
                            }
                        }}
                        className="active:bg-brand-cream flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-black/[0.06] transition-colors"
                    >
                        <item.icon className="text-brand-green h-5 w-5" />
                        <span className="text-brand-green flex-1 text-left text-sm font-medium">{item.label}</span>
                        <ChevronRight className="text-brand-muted-green h-4 w-4" />
                    </button>
                ))}
            </div>

            {/* Logout */}
            <div className="px-6 pb-6 pt-5">
                <button
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-6 py-3.5 text-[15px] font-bold text-red-600 transition-colors active:bg-red-100"
                >
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                </button>
            </div>
        </>
    );
}
