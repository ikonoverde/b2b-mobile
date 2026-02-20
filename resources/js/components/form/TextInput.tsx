import type { LucideIcon } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
    label: string;
    icon: LucideIcon;
    error?: string;
    rightElement?: ReactNode;
}

export function TextInput({ label, icon: Icon, error, rightElement, ...props }: TextInputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-brand-green">{label}</label>
            <div
                className={`flex h-[50px] items-center gap-3 rounded-xl bg-white px-4 border ${
                    error ? 'border-red-500' : 'border-transparent'
                }`}
            >
                <Icon className="h-5 w-5 shrink-0 text-brand-muted-green" />
                <input
                    className="flex-1 bg-transparent text-base text-brand-green placeholder:text-brand-muted-green outline-none"
                    {...props}
                />
                {rightElement}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
