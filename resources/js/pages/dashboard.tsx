import { Head, Link, usePage } from '@inertiajs/react';
import { ClipboardList, CreditCard, Package, ShoppingCart } from 'lucide-react';

import { ProductCard } from '@/components/products/ProductCard';
import { Auth } from '@/types/auth';

interface Product {
    id: number;
    name: string;
    category: string;
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
            <div className="flex flex-col gap-1 px-6 pt-6 pb-4">
                <span className="text-sm font-medium text-brand-muted-text">Bienvenido de vuelta</span>
                <h1 className="text-2xl font-bold text-brand-green">{auth.user?.name}</h1>
            </div>

            {/* Stats */}
            <div className="flex gap-3 px-6">
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-icon-bg-green">
                        <Package className="h-5 w-5 text-brand-green" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-brand-green">{profile.orders_count ?? 0}</span>
                        <span className="text-[11px] font-medium text-brand-muted-text">Pedidos</span>
                    </div>
                </div>
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-icon-bg-brown">
                        <CreditCard className="h-5 w-5 text-brand-accent-brown" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-brand-accent-brown">{profile.total_spent ?? 0}</span>
                        <span className="text-[11px] font-medium text-brand-muted-text">Compras</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-3 px-6 pt-5">
                <h2 className="text-sm font-bold text-brand-green">Acciones Rápidas</h2>
                <div className="flex gap-3">
                    <Link
                        href="/catalog"
                        className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-brand-green p-4"
                    >
                        <ShoppingCart className="h-6 w-6 text-white" />
                        <span className="text-[13px] font-semibold text-white">Nuevo Pedido</span>
                    </Link>
                    <Link
                        href="/orders"
                        className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06]"
                    >
                        <ClipboardList className="h-6 w-6 text-brand-green" />
                        <span className="text-[13px] font-semibold text-brand-green">Mis Pedidos</span>
                    </Link>
                </div>
            </div>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <div className="flex flex-col gap-4 px-6 pt-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-brand-green">Productos Destacados</h2>
                        <Link href="/catalog" className="text-[13px] font-semibold text-brand-accent-brown">
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
                                size={product.category}
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
