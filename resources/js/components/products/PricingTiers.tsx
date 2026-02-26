import { formatCurrency } from '@/lib/format';

interface PricingTier {
    min_quantity: number;
    max_quantity: number | null;
    price: number;
}

interface PricingTiersProps {
    tiers: PricingTier[];
    activeTier: PricingTier | null | undefined;
}

export function PricingTiers({ tiers, activeTier }: PricingTiersProps) {
    return (
        <div className="flex flex-col gap-3 px-6 pt-5">
            <h2 className="text-brand-green text-sm font-bold">Precios por Volumen</h2>
            <div className="flex flex-col gap-2">
                {tiers.map((tier, idx) => {
                    const isActive = activeTier === tier;
                    return (
                        <div
                            key={idx}
                            className={[
                                'flex items-center justify-between rounded-xl px-4 py-3 transition-colors duration-200',
                                isActive ? 'bg-brand-green/10 ring-brand-green/30 ring-1' : 'bg-white ring-1 ring-black/[0.06]',
                            ].join(' ')}
                        >
                            <div className="flex flex-col">
                                <span className={['text-[13px] font-semibold', isActive ? 'text-brand-green' : 'text-brand-muted-text'].join(' ')}>
                                    {tier.max_quantity ? `${tier.min_quantity} – ${tier.max_quantity} unidades` : `${tier.min_quantity}+ unidades`}
                                </span>
                            </div>
                            <span className={['text-base font-bold', isActive ? 'text-brand-accent-brown' : 'text-brand-muted-text'].join(' ')}>
                                {formatCurrency(tier.price)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
