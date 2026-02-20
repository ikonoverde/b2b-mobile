import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import AppLayout from './layouts/AppLayout';
import '../css/app.css';

// Expose Inertia router for NativePHP Edge components
window.router = router;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pages = import.meta.glob('./pages/**/*.tsx') as any;
        const page = (await resolvePageComponent(`./pages/${name}.tsx`, pages)) as {
            default: { layout?: unknown };
        };
        page.default.layout = page.default.layout || ((p: React.ReactNode) => <AppLayout>{p}</AppLayout>);
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
