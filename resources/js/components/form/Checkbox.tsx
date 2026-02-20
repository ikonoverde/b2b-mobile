import { Check } from 'lucide-react';
import type { ReactNode } from 'react';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    error?: string;
    children: ReactNode;
}

export function Checkbox({ checked, onChange, disabled, error, children }: CheckboxProps) {
    return (
        <div className="flex flex-col gap-1">
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex items-start gap-3 py-2">
                <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    disabled={disabled}
                    onClick={() => onChange(!checked)}
                    className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md ${
                        checked ? 'bg-brand-light-green' : 'bg-white'
                    }`}
                >
                    {checked && <Check className="h-3.5 w-3.5 text-brand-green" />}
                </button>
                <div className="flex-1 text-[13px] leading-snug text-brand-muted-green">{children}</div>
            </div>
        </div>
    );
}
