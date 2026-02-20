import type { ReactNode } from 'react';

import { UnauthHeader } from '@/components/home/UnauthHeader';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-brand-green">
            <UnauthHeader />

            <main className="flex flex-1 flex-col overflow-y-auto bg-brand-cream pb-6">{children}</main>
        </div>
    );
}
