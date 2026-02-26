import { Head, InfiniteScroll, router } from '@inertiajs/react';
import { Loader2, PackageOpen, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CatalogProductCard } from '@/components/catalog/CatalogProductCard';
import type { Category } from '@/types';

interface Product {
    id: number;
    name: string;
    category: Category;
    price: number;
    image: string;
    sku?: string;
    is_featured?: boolean;
}

interface CatalogProps {
    products: { data: Product[] };
    productsTotal: number;
}

export default function Catalog({ products, productsTotal }: CatalogProps) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search.trim()) return products.data;

        const q = search.toLowerCase();
        return products.data.filter(
            (p) => p.name.toLowerCase().includes(q) || p.category.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)),
        );
    }, [products.data, search]);

    function handleSearchChange(value: string) {
        setSearch(value);

        if (value && products.data.length > 15) {
            router.reload({ reset: ['products'] });
        }
    }

    return (
        <>
            <Head title="Catálogo" />

            <div className="flex flex-col gap-4 px-6 pb-4 pt-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-brand-green text-xl font-bold">Catálogo</h1>
                    <span className="text-brand-muted-text text-[13px] font-medium">
                        {search ? filtered.length : productsTotal} {(search ? filtered.length : productsTotal) === 1 ? 'producto' : 'productos'}
                    </span>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="text-brand-muted-green absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Buscar producto, categoría o SKU..."
                        className="text-brand-green placeholder:text-brand-muted-green/60 focus:ring-brand-green/30 w-full rounded-xl border-0 bg-white py-2.5 pl-9 pr-9 text-sm shadow-sm ring-1 ring-black/[0.06] focus:outline-none focus:ring-2"
                    />
                    {search && (
                        <button onClick={() => handleSearchChange('')} className="text-brand-muted-green absolute right-3 top-1/2 -translate-y-1/2">
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Product Grid */}
            {filtered.length > 0 ? (
                <InfiniteScroll
                    data="products"
                    preserveUrl
                    onlyNext
                    loading={
                        <div className="flex justify-center py-4">
                            <Loader2 className="text-brand-muted-green h-6 w-6 animate-spin" />
                        </div>
                    }
                >
                    <div className="grid grid-cols-2 gap-3 px-6 pb-6">
                        {filtered.map((product) => (
                            <CatalogProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                category={product.category.name}
                                price={product.price}
                                image={product.image}
                                isFeatured={product.is_featured}
                            />
                        ))}
                    </div>
                </InfiniteScroll>
            ) : (
                <div className="flex flex-col items-center gap-3 px-6 py-12">
                    <div className="bg-brand-icon-bg-green flex h-14 w-14 items-center justify-center rounded-full">
                        <PackageOpen className="text-brand-green h-7 w-7" />
                    </div>
                    <p className="text-brand-muted-text text-center text-sm">
                        No se encontraron productos
                        {search && (
                            <>
                                {' '}
                                para "<span className="text-brand-green font-semibold">{search}</span>"
                            </>
                        )}
                    </p>
                </div>
            )}
        </>
    );
}
