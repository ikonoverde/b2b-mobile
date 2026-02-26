import type { LucideIcon } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
    label: string;
    icon?: LucideIcon;
    error?: string;
    rightElement?: ReactNode;
}

export function TextInput({ label, icon: Icon, error, rightElement, ...props }: TextInputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-brand-green text-[13px] font-semibold">{label}</label>
            <div className={`flex h-[50px] items-center gap-3 rounded-xl border bg-white px-4 ${error ? 'border-red-500' : 'border-transparent'}`}>
                {Icon && <Icon className="text-brand-muted-green h-5 w-5 shrink-0" />}
                <input className="text-brand-green placeholder:text-brand-muted-green flex-1 bg-transparent text-base outline-none" {...props} />
                {rightElement}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
