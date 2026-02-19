import { Link } from '@inertiajs/react';

export function UnauthHeader() {
    return (
        <header className="bg-brand-green">
            <div className="flex items-center justify-between px-6 py-5">
                <div className="flex flex-col gap-0.5">
                    <span className="text-lg font-bold tracking-[0.15em] text-white">IKONO VERDE</span>
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-brand-light-green">
                        PROFESIONAL
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/login"
                        className="rounded-lg border border-white/30 px-3 py-2 text-[13px] font-semibold text-white"
                    >
                        Ingresar
                    </Link>
                    <Link
                        href="/register"
                        className="rounded-lg bg-white px-3 py-2 text-[13px] font-semibold text-brand-green"
                    >
                        Registrarse
                    </Link>
                </div>
            </div>
        </header>
    );
}
