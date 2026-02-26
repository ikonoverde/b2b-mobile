import { usePage } from '@inertiajs/react';
import { Agentation } from 'agentation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { UnauthHeader } from '@/components/home/UnauthHeader';

function updateBottomNav(cartItemCount: number) {
    const badge = cartItemCount > 0 ? String(cartItemCount) : null;
    const currentPath = window.location.pathname;

    const components = [
        {
            type: 'bottom_nav',
            data: {
                label_visibility: 'labeled',
                children: [
                    {
                        type: 'bottom_nav_item',
                        data: { id: 'home', icon: 'home', label: 'Inicio', url: '/', active: currentPath === '/' || currentPath === '/dashboard' },
                    },
                    {
                        type: 'bottom_nav_item',
                        data: { id: 'catalog', icon: 'grid_view', label: 'Catálogo', url: '/catalog', active: currentPath.startsWith('/catalog') },
                    },
                    {
                        type: 'bottom_nav_item',
                        data: { id: 'cart', icon: 'shopping_cart', label: 'Carrito', url: '/cart', badge, active: currentPath.startsWith('/cart') },
                    },
                    {
                        type: 'bottom_nav_item',
                        data: { id: 'account', icon: 'person', label: 'Cuenta', url: '/account', active: currentPath.startsWith('/account') },
                    },
                ],
            },
        },
    ];

    fetch('/_native/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'Edge.Set', params: { components } }),
    }).catch(() => {
        // Not running in NativePHP context
    });
}

function useBottomNavSync() {
    const { cartItemCount } = usePage<{ cartItemCount: number }>().props;

    useEffect(() => {
        updateBottomNav(cartItemCount);
    }, [cartItemCount]);
}

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    useBottomNavSync();

    return (
        <>
            <div className="bg-brand-green flex min-h-screen flex-col">
                <UnauthHeader />

                <main className="bg-brand-cream flex flex-1 flex-col overflow-y-auto pb-6">{children}</main>
            </div>
            <Agentation />
        </>
    );
}
