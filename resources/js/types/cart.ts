export type CartItem = {
    id: number;
    product_id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    subtotal: number;
};

export type CartTotals = {
    subtotal: number;
    shipping: number;
    total: number;
};

export type Cart = {
    items: CartItem[];
    totals: CartTotals;
};
