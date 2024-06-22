import sql from "~/app/db.server";
import { OrderTracking } from "~/app/lib/defitions";

export type OrderTableData = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    payment_method: "e-wallet" | "mobile-banking" | "in-person";
    status: "pending" | "paid";
    created_at: string;
    total: number;
};

export async function getOrderTable(groupId: string) {
    try {
        const orders = await sql<OrderTableData[]>`
            SELECT 
                orders.id,
                customers.first_name,
                customers.last_name,
                customers.email,
                payments.payment_method,
                payments.status,
                orders.created_at,
                orders.total
            FROM orders INNER JOIN customers 
                ON orders.customer_id = customers.id
            INNER JOIN payments
                on payments.order_id = orders.id
            WHERE orders.group_id = ${groupId}
        `;

        return orders;
    } catch (error) {
        console.log("error while getting orders table-data: ", error);
    }
}

export type OrderDetails = {
    id: string;
    sub_total: number;
    delivery_charge?: number;
    discount_in_percentage?: number;
    total: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: number;
    street_address: string;
    city: string;
    postal_code: number;
    products: [{ name: string; quantity: number; selling_price: number }];
    created_at: string;
};

export async function getOrderDetails(orderId: string | null) {
    try {
        const [details] = await sql<OrderDetails[]>`
            SELECT
                orders.id,
                orders.sub_total,
                orders.delivery_charge,
                orders.discount_in_percentage,
                orders.total,
                orders.created_at,
                customers.first_name,
                customers.last_name,
                customers.email,
                customers.phone_number,
                customer_address.street_address,
                customer_address.city,
                customer_address.postal_code,
                jsonb_agg(jsonb_build_object('name', order_details.product_name, 'quantity', order_details.quantity, 'price', order_details.selling_price)) AS products
            FROM orders
            INNER JOIN order_details
                ON order_details.order_id = orders.id
            INNER JOIN customers
                ON orders.customer_id = customers.id
            INNER JOIN customer_address
                ON orders.customer_address_id = customer_address.id
            WHERE orders.id = ${orderId}
            GROUP BY
                orders.id,
                orders.sub_total,
                orders.delivery_charge,
                orders.discount_in_percentage,
                orders.total,
                orders.created_at,
                customers.first_name,
                customers.last_name,
                customers.email,
                customers.phone_number,
                customer_address.street_address,
                customer_address.city,
                customer_address.postal_code
        `;

        return details;
    } catch (error) {
        console.log("error while getting order details: ", error);
    }
}

export async function getTrackingOrderDetails(
    orderId: string,
    groupId: string
) {
    try {
        const [details] = await sql<OrderTracking[]>`
            SELECT * FROM order_tracking 
            WHERE order_id = ${orderId} AND group_id = ${groupId}
        `;

        return details;
    } catch (error) {
        console.log("error while getting tracking-order details: ", error);
    }
}
