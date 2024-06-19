export type Groups = {
    id: string;
    business_name: string;
};

export type Users = {
    id: string;
    group_id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    roles: "admin" | "product-manager" | "sales-person";
    created_at: string;
};

export type Categories = {
    id: string;
    group_id: string;
    category_name: string;
    created_at: string;
};

export type Customers = {
    id: string;
    group_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: number;
    created_at: string;
};

export type Products = {
    id: string;
    group_id: string;
    product_name: string;
    description: string;
    category: string;
    status: "in-stock" | "out-of-stock";
    sku: string;
    stock: number;
    purchase_price: number;
    selling_price: number;
    created_at: string;
};

export type Orders = {
    id: string;
    group_id: string;
    product_id: string;
    customer_id: string;
    sub_total: number;
    delivery_charge: number;
    discount_in_percentage: number;
    total: number;
    street_address: string;
    city: string;
    provience: string;
    postal_code: number;
    payment_method: "e-wallet" | "mobile-banking" | "in-person";
    status: "pending" | "paid";
    date: string;
};

export type OrderTracking = {
    id: string;
    group_id: string;
    order_id: string;
    customer_id: string;
    status: "order_created" | "processing" | "shipped" | "delivered";
    created_at: string;
    processed_at: string;
    shipped_at: string;
    delivered_at: string;
};
