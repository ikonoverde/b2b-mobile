export interface Address {
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
    country: string;
    created_at: string;
    updated_at: string;
}
