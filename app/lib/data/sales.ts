import sql from "~/app/db.server";

export type SalesReport = {
    product_name: string;
    purchase_price: number;
    selling_price: number;
    quantity: number;
    total: number;
    created_at: string;
};

export async function getSalesReport(
    groupId: string,
    from: string,
    to: string
) {
    try {
        const sales = await sql<SalesReport[]>`
            SELECT 
                order_details.product_name,
                order_details.purchase_price,
                order_details.selling_price,
                order_details.quantity,
                orders.total,
                orders.created_at
            FROM orders INNER JOIN order_details
                ON order_details.order_id = orders.id
            WHERE (orders.created_at >= ${from} AND orders.created_at <= ${to}) 
                AND orders.group_id = ${groupId}
        `;

        return sales;
    } catch (error) {
        console.log("error while getting sales report: ", error);
    }
}
