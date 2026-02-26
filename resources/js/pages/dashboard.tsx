import { Head, Link, usePage } from '@inertiajs/react';
import { ClipboardList, CreditCard, Package, ShoppingCart } from 'lucide-react';

import { ProductCard } from '@/components/products/ProductCard';
import type { Category } from '@/types';
import type { Auth } from '@/types/auth';

interface Product {
    id: number;
    name: string;
    category: Category;
    price: number;
    image: string;
}

interface Profile {
    orders_count?: number;
    total_spent?: number;
    discount_percentage?: number;
}

interface DashboardProps {
    featuredProducts: Product[];
    profile: Profile;
}

export default function Dashboard({ featuredProducts, profile }: DashboardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <>
            <Head title="Inicio" />

            {/* Welcome */}
            <div className="flex flex-col gap-1 px-6 pb-4 pt-6">
                <span className="text-brand-muted-text text-sm font-medium">Bienvenido de vuelta</span>
                <h1 className="text-brand-green text-2xl font-bold">{auth.user?.name}</h1>
            </div>

            {/* Stats */}
            <div className="flex gap-3 px-6">
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06]">
                    <div className="bg-brand-icon-bg-green flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                        <Package className="text-brand-green h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-brand-green text-lg font-bold">{profile.orders_count ?? 0}</span>
                        <span className="text-brand-muted-text text-[11px] font-medium">Pedidos</span>
                    </div>
                </div>
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06]">
                    <div className="bg-brand-icon-bg-brown flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                        <CreditCard className="text-brand-accent-brown h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-brand-accent-brown text-lg font-bold">{profile.total_spent ?? 0}</span>
                        <span className="text-brand-muted-text text-[11px] font-medium">Compras</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-3 px-6 pt-5">
                <h2 className="text-brand-green text-sm font-bold">Acciones Rápidas</h2>
                <div className="flex gap-3">
                    <Link href="/catalog" className="bg-brand-green flex flex-1 flex-col items-center gap-2 rounded-2xl p-4">
                        <ShoppingCart className="h-6 w-6 text-white" />
                        <span className="text-[13px] font-semibold text-white">Nuevo Pedido</span>
                    </Link>
                    <Link
                        href="/orders"
                        className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06]"
                    >
                        <ClipboardList className="text-brand-green h-6 w-6" />
                        <span className="text-brand-green text-[13px] font-semibold">Mis Pedidos</span>
                    </Link>
                </div>
            </div>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <div className="flex flex-col gap-4 px-6 pt-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-brand-green text-lg font-bold">Productos Destacados</h2>
                        <Link href="/catalog" className="text-brand-accent-brown text-[13px] font-semibold">
                            Ver todo
                        </Link>
                    </div>
                    <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2">
                        {featuredProducts.slice(0, 4).map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                imageUrl={product.image}
                                name={product.name}
                                size={product.category.name}
                                price={product.price}
                                showPrice
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
