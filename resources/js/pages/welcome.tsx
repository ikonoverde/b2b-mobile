import { Head, Link, usePage } from '@inertiajs/react';
import { Grid, Headphones, Percent, Truck, UserPlus } from 'lucide-react';

import { BenefitCard } from '@/components/home/BenefitCard';
import { ProductCard } from '@/components/products/ProductCard';
import { Auth } from '@/types/auth';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
}

interface WelcomeProps {
    featuredProducts: Product[];
}

export default function Welcome({ featuredProducts }: WelcomeProps) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <>
            <Head title="IKONO VERDE PROFESIONAL">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=nunito:400,500,600,700" rel="stylesheet" />
            </Head>

            {/* Hero Section */}
            <div className="flex flex-col gap-2 px-6 pt-6 pb-4">
                <h1 className="text-[28px] leading-9 font-bold">
                    <span className="text-brand-green">Productos Mayoristas</span>
                    <br />
                    <span className="text-brand-accent-brown">para tu Negocio</span>
                </h1>
                <p className="text-sm leading-[21px] text-brand-muted-text">
                    Accede a precios exclusivos, pedidos recurrentes y soporte dedicado para profesionales.
                </p>
            </div>

            {/* Benefits Row */}
            <div className="flex gap-3 px-6 py-2">
                <BenefitCard icon={Percent} title="Precios" subtitle="Mayoristas" iconBackground="green" />
                <BenefitCard icon={Truck} title="Envío" subtitle="Gratis +$500k" iconBackground="brown" />
                <BenefitCard icon={Headphones} title="Soporte" subtitle="Dedicado" iconBackground="green" />
            </div>

            {/* CTA Section */}
            {!auth.user && (
                <div className="flex flex-col gap-3 px-6 pb-2">
                    <Link href="/register" className="flex flex-col items-center gap-3 rounded-2xl bg-brand-green p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                            <UserPlus className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-[13px] font-semibold text-white">Crear Cuenta</span>
                    </Link>
                    <Link href="/catalog" className="flex flex-col items-center gap-3 rounded-2xl bg-white p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-icon-bg-green">
                            <Grid className="h-6 w-6 text-brand-green" />
                        </div>
                        <span className="text-[13px] font-semibold text-brand-green">Ver Catálogo</span>
                    </Link>
                </div>
            )}

            {/* Featured Products */}
            <div className="flex flex-col gap-4 px-6 pt-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-brand-green">Productos Destacados</h2>
                    <Link href="/catalog" className="text-[13px] font-semibold text-brand-accent-brown">
                        Ver todo
                    </Link>
                </div>
                <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2">
                    {featuredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            imageUrl={product.image}
                            name={product.name}
                            size={product.category}
                            price={product.price}
                            showPrice={!!auth.user}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
