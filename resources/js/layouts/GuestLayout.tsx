import type { ReactNode } from 'react';

import { UnauthBottomNav } from '@/components/home/UnauthBottomNav';
import { UnauthHeader } from '@/components/home/UnauthHeader';
import { Agentation } from 'agentation';

interface GuestLayoutProps {
    children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-brand-green">
            <UnauthHeader />

            <main className="flex flex-1 flex-col overflow-y-auto bg-brand-cream pb-6">{children}</main>

            <UnauthBottomNav activeTab="home" />
            <Agentation />
        </div>
    );
}
