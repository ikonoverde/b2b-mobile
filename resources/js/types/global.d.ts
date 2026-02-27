import type { Router } from '@inertiajs/core';
import type { Auth } from '@/types/auth';

declare global {
    interface Window {
        router: Router;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            cartItemCount: number;
            sidebarOpen: boolean;
            flash: {
                status: string | null;
                reorderUnavailable: { product_id: number; product_name: string; reason: string }[] | null;
                reorderPriceChanges: {
                    product_id: number;
                    product_name: string;
                    original_price: number;
                    current_price: number;
                }[] | null;
            };
            [key: string]: unknown;
        };
    }
}
