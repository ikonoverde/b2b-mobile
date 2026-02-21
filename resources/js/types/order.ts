export type ShippingAddress = {
    name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
};

export type OrderItem = {
    id: number;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
};

export type Order = {
    id: number;
    status: string;
    items: OrderItem[];
    shipping_address: ShippingAddress;
    subtotal: number;
    shipping: number;
    total: number;
    created_at: string;
    updated_at: string;
};
