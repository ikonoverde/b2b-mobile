import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Check, Hash, Loader2, Map, MapPin, Pencil, Phone, Plus, Tag, Trash2, User } from 'lucide-react';
import { useState } from 'react';

import { TextInput } from '@/components/form/TextInput';

interface Address {
    id: number;
    label: string;
    name: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
    is_default: boolean;
}

interface AddressesProps {
    addresses: Address[];
}

type Mode = 'list' | 'add' | 'edit';

interface AddressFormData {
    label: string;
    name: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
    is_default: boolean;
}

const emptyFormData: AddressFormData = {
    label: '',
    name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    phone: '',
    is_default: false,
};

function formatAddress(address: Address): string {
    const parts = [address.address_line_1];

    if (address.address_line_2) {
        parts.push(address.address_line_2);
    }

    parts.push(`${address.city}, ${address.state} ${address.postal_code}`);

    return parts.join(', ');
}

function AddressCard({ address, onEdit, onDelete }: { address: Address; onEdit: () => void; onDelete: () => void }) {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06]">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-brand-green text-sm font-bold">{address.label}</span>
                        {address.is_default && (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                                <Check className="h-3 w-3" />
                                Predeterminada
                            </span>
                        )}
                    </div>
                    <span className="text-brand-green text-sm font-medium">{address.name}</span>
                    <span className="text-brand-muted-text text-[13px] leading-relaxed">{formatAddress(address)}</span>
                    <div className="flex items-center gap-1.5 pt-0.5">
                        <Phone className="text-brand-muted-green h-3.5 w-3.5" />
                        <span className="text-brand-muted-text text-[13px]">{address.phone}</span>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={onEdit}
                        className="bg-brand-cream active:bg-brand-cream/70 flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
                    >
                        <Pencil className="text-brand-green h-4 w-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 transition-colors active:bg-red-100"
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function AddressForm({ initialData, editingId, onCancel }: { initialData: AddressFormData; editingId: number | null; onCancel: () => void }) {
    const form = useForm<AddressFormData>(initialData);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (editingId) {
            form.put(`/account/addresses/${editingId}`, {
                onSuccess: () => onCancel(),
                preserveScroll: true,
            });
        } else {
            form.post('/account/addresses', {
                onSuccess: () => onCancel(),
                preserveScroll: true,
            });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 px-6 pb-6 pt-5">
            <h2 className="text-brand-green text-sm font-bold">{editingId ? 'Editar Dirección' : 'Nueva Dirección'}</h2>

            <TextInput
                label="Etiqueta (ej: Oficina, Bodega)"
                icon={Tag}
                placeholder="Nombre para esta dirección"
                value={form.data.label}
                onChange={(e) => form.setData('label', e.target.value)}
                disabled={form.processing}
                error={form.errors.label}
            />

            <TextInput
                label="Nombre de contacto"
                icon={User}
                placeholder="Nombre completo"
                value={form.data.name}
                onChange={(e) => form.setData('name', e.target.value)}
                disabled={form.processing}
                error={form.errors.name}
            />

            <TextInput
                label="Dirección"
                icon={MapPin}
                placeholder="Calle y número"
                value={form.data.address_line_1}
                onChange={(e) => form.setData('address_line_1', e.target.value)}
                disabled={form.processing}
                error={form.errors.address_line_1}
            />

            <TextInput
                label="Dirección línea 2 (opcional)"
                placeholder="Interior, colonia, etc."
                value={form.data.address_line_2}
                onChange={(e) => form.setData('address_line_2', e.target.value)}
                disabled={form.processing}
                error={form.errors.address_line_2}
            />

            <div className="grid grid-cols-2 gap-3">
                <TextInput
                    label="Ciudad"
                    icon={Building2}
                    placeholder="Ciudad"
                    value={form.data.city}
                    onChange={(e) => form.setData('city', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.city}
                />
                <TextInput
                    label="Estado"
                    icon={Map}
                    placeholder="Estado"
                    value={form.data.state}
                    onChange={(e) => form.setData('state', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.state}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <TextInput
                    label="Código Postal"
                    icon={Hash}
                    placeholder="00000"
                    value={form.data.postal_code}
                    onChange={(e) => form.setData('postal_code', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.postal_code}
                />
                <TextInput
                    label="Teléfono"
                    icon={Phone}
                    type="tel"
                    placeholder="10 dígitos"
                    value={form.data.phone}
                    onChange={(e) => form.setData('phone', e.target.value)}
                    disabled={form.processing}
                    error={form.errors.phone}
                />
            </div>

            <label className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-black/[0.06]">
                <input
                    type="checkbox"
                    checked={form.data.is_default}
                    onChange={(e) => form.setData('is_default', e.target.checked)}
                    disabled={form.processing}
                    className="text-brand-green focus:ring-brand-green h-5 w-5 rounded border-gray-300"
                />
                <span className="text-brand-green text-sm font-medium">Usar como dirección predeterminada</span>
            </label>

            <button
                type="submit"
                disabled={form.processing}
                className="bg-brand-green flex h-14 items-center justify-center rounded-2xl font-bold text-white disabled:opacity-70"
            >
                {form.processing ? <Loader2 className="h-5 w-5 animate-spin" /> : editingId ? 'Guardar Cambios' : 'Guardar Dirección'}
            </button>

            <button
                type="button"
                onClick={onCancel}
                disabled={form.processing}
                className="text-brand-muted-text active:bg-brand-cream flex h-12 items-center justify-center rounded-2xl text-sm font-semibold transition-colors"
            >
                Cancelar
            </button>
        </form>
    );
}

export default function Addresses({ addresses }: AddressesProps) {
    const [mode, setMode] = useState<Mode>('list');
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    function handleEdit(address: Address) {
        setEditingAddress(address);
        setMode('edit');
    }

    function handleDelete(address: Address) {
        if (window.confirm('¿Estás seguro de eliminar esta dirección?')) {
            router.delete(`/account/addresses/${address.id}`, {
                preserveScroll: true,
            });
        }
    }

    function handleCancel() {
        setEditingAddress(null);
        setMode('list');
    }

    function getInitialFormData(): AddressFormData {
        if (mode === 'edit' && editingAddress) {
            return {
                label: editingAddress.label,
                name: editingAddress.name,
                address_line_1: editingAddress.address_line_1,
                address_line_2: editingAddress.address_line_2 ?? '',
                city: editingAddress.city,
                state: editingAddress.state,
                postal_code: editingAddress.postal_code,
                phone: editingAddress.phone,
                is_default: editingAddress.is_default,
            };
        }

        return { ...emptyFormData };
    }

    return (
        <>
            <Head title="Direcciones de Envío" />

            {/* Header */}
            <div className="flex items-center gap-3 px-6 pb-4 pt-6">
                <button
                    onClick={() => {
                        if (mode !== 'list') {
                            handleCancel();
                        } else {
                            router.visit('/account');
                        }
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06]"
                >
                    <ArrowLeft className="text-brand-green h-5 w-5" />
                </button>
                <h1 className="text-brand-green text-lg font-bold">Direcciones de Envío</h1>
            </div>

            {mode === 'list' && (
                <div className="flex flex-col gap-3 px-6 pb-24">
                    {/* Add button */}
                    <button
                        onClick={() => setMode('add')}
                        className="border-brand-green/30 bg-brand-green/5 text-brand-green active:bg-brand-green/10 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 text-sm font-semibold transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar dirección
                    </button>

                    {addresses.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-16">
                            <div className="bg-brand-green/10 flex h-16 w-16 items-center justify-center rounded-full">
                                <MapPin className="text-brand-green h-8 w-8" />
                            </div>
                            <p className="text-brand-muted-text text-sm font-medium">No tienes direcciones guardadas</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {addresses.map((address) => (
                                <AddressCard
                                    key={address.id}
                                    address={address}
                                    onEdit={() => handleEdit(address)}
                                    onDelete={() => handleDelete(address)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {(mode === 'add' || mode === 'edit') && (
                <AddressForm
                    key={editingAddress?.id ?? 'new'}
                    initialData={getInitialFormData()}
                    editingId={editingAddress?.id ?? null}
                    onCancel={handleCancel}
                />
            )}
        </>
    );
}
