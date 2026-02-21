import { Head, Link } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';

export default function OrdersIndex() {
    return (
        <>
            <Head title="Mis Pedidos" />

            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-icon-bg-green">
                    <ClipboardList className="h-10 w-10 text-brand-green" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <h1 className="text-xl font-bold text-brand-green">Próximamente</h1>
                    <p className="text-center text-sm text-brand-muted-text">
                        El historial de pedidos estará disponible pronto.
                    </p>
                </div>
                <div className="flex gap-3 pt-2">
                    <Link
                        href="/dashboard"
                        className="rounded-xl bg-white px-5 py-2.5 text-[13px] font-semibold text-brand-green shadow-sm ring-1 ring-black/[0.06]"
                    >
                        Ir al Inicio
                    </Link>
                    <Link
                        href="/catalog"
                        className="rounded-xl bg-brand-green px-5 py-2.5 text-[13px] font-semibold text-white"
                    >
                        Ver Catálogo
                    </Link>
                </div>
            </div>
        </>
    );
}
