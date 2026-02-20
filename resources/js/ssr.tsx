import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { renderToString } from 'react-dom/server';
import AppLayout from './layouts/AppLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
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
        setup: ({ App, props }) => <App {...props} />,
    }),
);
