/** Used for the checkout shipping form submission. */
export type ShippingFormData = {
    name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
};

/** Shipping address as returned by the API on orders. */
export type ShippingAddress = {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
};

export type OrderItem = {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image: string;
};

export type Order = {
    id: number;
    status: string;
    payment_status: string;
    total_amount: number;
    shipping_cost: number;
    shipping_address: ShippingAddress;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
};

export type PaginatedOrders = {
    data: Order[];
};
