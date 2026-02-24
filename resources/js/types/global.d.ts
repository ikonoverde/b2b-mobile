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
            flash: { status: string | null };
            [key: string]: unknown;
        };
    }
}
