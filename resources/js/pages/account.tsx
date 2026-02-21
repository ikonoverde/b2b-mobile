import { Head, router, usePage } from '@inertiajs/react';
import {
    Building2,
    ChevronRight,
    CreditCard,
    Headphones,
    LogOut,
    MapPin,
    Package,
    Percent,
    Users,
} from 'lucide-react';

import { Auth } from '@/types/auth';

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
        { icon: CreditCard, label: 'Datos de Facturación', href: '#' },
        { icon: MapPin, label: 'Direcciones de Envío', href: '#' },
        { icon: Users, label: 'Usuarios Autorizados', href: '#' },
        { icon: Headphones, label: 'Soporte Comercial', href: '#' },
    ];

    return (
        <>
            <Head title="Mi Cuenta" />

            {/* Profile Header */}
            <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-green">
                    <span className="text-2xl font-bold text-white">{initials}</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-lg font-bold text-brand-green">{user.name}</span>
                    {user.rfc && (
                        <span className="text-[11px] font-medium tracking-wide text-brand-muted-green uppercase">
                            RFC: {user.rfc}
                        </span>
                    )}
                    <span className="text-sm text-brand-muted-text">{user.email}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="flex gap-2 px-6">
                <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/[0.06]">
                    <Package className="h-5 w-5 text-brand-green" />
                    <span className="text-lg font-bold text-brand-green">{profile.orders_count ?? 0}</span>
                    <span className="text-[10px] font-medium text-brand-muted-text">Pedidos</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/[0.06]">
                    <Building2 className="h-5 w-5 text-brand-accent-brown" />
                    <span className="text-lg font-bold text-brand-accent-brown">{profile.total_spent ?? 0}</span>
                    <span className="text-[10px] font-medium text-brand-muted-text">Compras</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/[0.06]">
                    <Percent className="h-5 w-5 text-brand-green" />
                    <span className="text-lg font-bold text-brand-green">{profile.discount_percentage ?? 0}%</span>
                    <span className="text-[10px] font-medium text-brand-muted-text">Descuento</span>
                </div>
            </div>

            {/* Menu */}
            <div className="flex flex-col gap-1 px-6 pt-5">
                <h2 className="mb-2 text-sm font-bold text-brand-green">Configuración</h2>
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-black/[0.06] transition-colors active:bg-brand-cream"
                    >
                        <item.icon className="h-5 w-5 text-brand-green" />
                        <span className="flex-1 text-left text-sm font-medium text-brand-green">{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-brand-muted-green" />
                    </button>
                ))}
            </div>

            {/* Logout */}
            <div className="px-6 pt-5 pb-6">
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
