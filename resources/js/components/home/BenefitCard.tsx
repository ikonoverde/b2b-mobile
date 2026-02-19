import type { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    iconBackground?: 'green' | 'brown';
}

export function BenefitCard({ icon: Icon, title, subtitle, iconBackground = 'green' }: BenefitCardProps) {
    const iconBgClass = iconBackground === 'green' ? 'bg-brand-icon-bg-green' : 'bg-brand-icon-bg-brown';
    const iconColorClass = iconBackground === 'green' ? 'text-brand-green' : 'text-brand-accent-brown';

    return (
        <div className="flex flex-1 flex-col gap-2 rounded-2xl bg-white p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBgClass}`}>
                <Icon className={`h-[18px] w-[18px] ${iconColorClass}`} />
            </div>
            <span className="text-[15px] font-bold text-brand-green">{title}</span>
            <span className="text-[11px] font-medium text-brand-accent-brown">{subtitle}</span>
        </div>
    );
}
