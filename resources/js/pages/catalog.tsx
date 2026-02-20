import { Head } from '@inertiajs/react';
import { PackageOpen, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CatalogProductCard } from '@/components/catalog/CatalogProductCard';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    sku?: string;
    is_featured?: boolean;
}

interface CatalogProps {
    products: Product[];
}

export default function Catalog({ products }: CatalogProps) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search.trim()) return products;

        const q = search.toLowerCase();
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                (p.sku && p.sku.toLowerCase().includes(q)),
        );
    }, [products, search]);

    return (
        <>
            <Head title="Catálogo" />

            <div className="flex flex-col gap-4 px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-brand-green">Catálogo</h1>
                    <span className="text-[13px] font-medium text-brand-muted-text">
                        {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
                    </span>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-brand-muted-green" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar producto, categoría o SKU..."
                        className="w-full rounded-xl border-0 bg-white py-2.5 pr-9 pl-9 text-sm text-brand-green shadow-sm ring-1 ring-black/[0.06] placeholder:text-brand-muted-green/60 focus:ring-2 focus:ring-brand-green/30 focus:outline-none"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-brand-muted-green"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Product Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 px-6 pb-6">
                    {filtered.map((product) => (
                        <CatalogProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            category={product.category}
                            price={product.price}
                            image={product.image}
                            isFeatured={product.is_featured}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-3 px-6 py-12">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-icon-bg-green">
                        <PackageOpen className="h-7 w-7 text-brand-green" />
                    </div>
                    <p className="text-center text-sm text-brand-muted-text">
                        No se encontraron productos
                        {search && (
                            <>
                                {' '}
                                para "<span className="font-semibold text-brand-green">{search}</span>"
                            </>
                        )}
                    </p>
                </div>
            )}
        </>
    );
}
