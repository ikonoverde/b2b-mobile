import { Head, InfiniteScroll, router } from '@inertiajs/react';
import { ChevronDown, LayoutGrid, List, Loader2, PackageOpen, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CatalogProductCard } from '@/components/catalog/CatalogProductCard';
import { CatalogProductListCard } from '@/components/catalog/CatalogProductListCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

const SORT_OPTIONS = [
    { label: 'Mas recientes', value: 'newest' },
    { label: 'Precio: menor a mayor', value: 'price_asc' },
    { label: 'Precio: mayor a menor', value: 'price_desc' },
    { label: 'Nombre: A-Z', value: 'name_asc' },
    { label: 'Nombre: Z-A', value: 'name_desc' },
] as const;

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
    categories: Category[];
    selectedCategoryId: number | null;
    selectedSort: string;
}

export default function Catalog({ products, productsTotal, categories, selectedCategoryId, selectedSort }: CatalogProps) {
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useLocalStorage<'grid' | 'list'>('catalog-view', 'grid');

    const filtered = useMemo(() => {
        if (!search.trim()) return products.data;

        const q = search.toLowerCase();
        return products.data.filter(
            (p) => p.name.toLowerCase().includes(q) || p.category.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)),
        );
    }, [products.data, search]);

    function handleCategorySelect(categoryId: number | null) {
        const query: Record<string, string> = { sort: selectedSort };
        if (categoryId !== null) {
            query.category_id = String(categoryId);
        }

        router.get(window.location.pathname, query, {
            preserveState: false,
            preserveScroll: false,
        });
    }

    function handleSortChange(sort: string) {
        const query: Record<string, string> = { sort };
        if (selectedCategoryId !== null) {
            query.category_id = String(selectedCategoryId);
        }

        router.get(window.location.pathname, query, {
            preserveState: false,
            preserveScroll: false,
        });
    }

    function handleSearchChange(value: string) {
        setSearch(value);

        if (value && products.data.length > 15) {
            router.reload({ reset: ['products'] });
        }
    }

    return (
        <>
            <Head title="Catalogo" />

            <div className="flex flex-col gap-4 px-6 pb-4 pt-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-brand-green text-xl font-bold">Catalogo</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-brand-muted-text text-[13px] font-medium">
                            {search ? filtered.length : productsTotal} {(search ? filtered.length : productsTotal) === 1 ? 'producto' : 'productos'}
                        </span>
                        <div className="flex overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/[0.06]">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center transition-colors',
                                    viewMode === 'grid' ? 'bg-brand-light-green text-brand-green' : 'text-brand-muted-text',
                                )}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center transition-colors',
                                    viewMode === 'list' ? 'bg-brand-light-green text-brand-green' : 'text-brand-muted-text',
                                )}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="text-brand-muted-green absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Buscar producto, categoria o SKU..."
                        className="text-brand-green placeholder:text-brand-muted-green/60 focus:ring-brand-green/30 w-full rounded-xl border-0 bg-white py-2.5 pl-9 pr-9 text-sm shadow-sm ring-1 ring-black/[0.06] focus:outline-none focus:ring-2"
                    />
                    {search && (
                        <button onClick={() => handleSearchChange('')} className="text-brand-muted-green absolute right-3 top-1/2 -translate-y-1/2">
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Sort */}
                <div className="relative">
                    <select
                        value={selectedSort}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="text-brand-green focus:ring-brand-green/30 w-full appearance-none rounded-xl border-0 bg-white py-2.5 pl-3 pr-9 text-sm font-medium shadow-sm ring-1 ring-black/[0.06] focus:outline-none focus:ring-2"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="text-brand-muted-green pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                </div>

                {/* Category Tabs */}
                {categories.length > 0 && (
                    <div className="-mx-6 overflow-x-auto px-6">
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleCategorySelect(null)}
                                className={cn(
                                    'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                                    selectedCategoryId === null
                                        ? 'bg-brand-light-green text-brand-green'
                                        : 'text-brand-muted-text bg-white shadow-sm ring-1 ring-black/[0.06]',
                                )}
                            >
                                Todos
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategorySelect(category.id)}
                                    className={cn(
                                        'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                                        selectedCategoryId === category.id
                                            ? 'bg-brand-light-green text-brand-green'
                                            : 'text-brand-muted-text bg-white shadow-sm ring-1 ring-black/[0.06]',
                                    )}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
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
                    <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3 px-6 pb-6' : 'flex flex-col gap-3 px-6 pb-6'}>
                        {filtered.map((product) =>
                            viewMode === 'grid' ? (
                                <CatalogProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    category={product.category.name}
                                    price={product.price}
                                    image={product.image}
                                    sku={product.sku}
                                    isFeatured={product.is_featured}
                                />
                            ) : (
                                <CatalogProductListCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    category={product.category.name}
                                    price={product.price}
                                    image={product.image}
                                    sku={product.sku}
                                />
                            ),
                        )}
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
