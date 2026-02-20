import { Lock } from 'lucide-react';

interface ProductCardProps {
    imageUrl: string;
    name: string;
    size: string;
    price: string;
    showPrice?: boolean;
}

export function ProductCard({ imageUrl, name, size, price, showPrice = true }: ProductCardProps) {
    return (
        <div className="w-40 shrink-0 overflow-hidden rounded-2xl bg-white">
            <img src={imageUrl} alt={name} className="h-20 w-full object-cover" />
            <div className="flex flex-col gap-1 p-3">
                <span className="text-[13px] font-semibold text-brand-green">{name}</span>
                <span className="text-[11px] text-brand-muted-green">{size}</span>
                {showPrice ? (
                    <span className="text-[15px] font-bold text-brand-accent-brown">{price}</span>
                ) : (
                    <div className="flex w-fit items-center gap-1 rounded-md bg-brand-light-green/10 px-2 py-1">
                        <Lock className="h-3 w-3 text-brand-accent-brown" />
                        <span className="text-[11px] font-semibold text-brand-accent-brown">Inicia sesión</span>
                    </div>
                )}
            </div>
        </div>
    );
}
