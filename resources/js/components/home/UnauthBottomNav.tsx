import { Link } from '@inertiajs/react';
import { Grid, Home, LogIn } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type TabName = 'home' | 'catalog' | 'login';

interface TabItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
    isActive?: boolean;
}

function TabItem({ icon: Icon, label, href, isActive = false }: TabItemProps) {
    const colorClass = isActive ? 'text-brand-green' : 'text-[#8B8B8B]';
    const fontClass = isActive ? 'font-semibold' : 'font-medium';

    return (
        <Link href={href} className={`flex flex-col items-center gap-1 ${colorClass}`}>
            <Icon className="h-6 w-6" />
            <span className={`text-[11px] ${fontClass}`}>{label}</span>
        </Link>
    );
}

interface UnauthBottomNavProps {
    activeTab?: TabName;
}

export function UnauthBottomNav({ activeTab = 'home' }: UnauthBottomNavProps) {
    return (
        <nav className="flex items-center justify-around bg-white px-6 pb-3 pt-3">
            <TabItem icon={Home} label="Home" href="/" isActive={activeTab === 'home'} />
            <TabItem icon={Grid} label="Catalog" href="/login" isActive={activeTab === 'catalog'} />
            <TabItem icon={LogIn} label="Login" href="/login" isActive={activeTab === 'login'} />
        </nav>
    );
}
