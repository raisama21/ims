import sql from "~/app/db.server";

export type SalesReport = {
    total_orders: number;
    total_sales: number;
    total_units_sold: number;
    product_name: string;
    product_sales: number;
};

export async function getSalesReport() {
    try {
        const sales = await sql<SalesReport[]>`
            -- Sales Report for the Current Month
        WITH order_summary AS (
            SELECT
                o.id AS order_id,
                o.sub_total,
                o.delivery_charge,
                o.discount_in_percentage,
                o.total,
                o.created_at,
                d.product_name,
                d.quantity,
                d.price
            FROM
                orders o
                JOIN order_details d ON o.id = d.order_id
            WHERE
                o.created_at >= DATE_TRUNC('month', NOW())
                AND o.created_at < NOW()
        ),
        sales_summary AS (
            SELECT
                order_id,
                product_name,
                SUM(quantity) AS total_quantity,
                SUM(price * quantity) AS product_total
            FROM
                order_summary
            GROUP BY
                order_id, product_name
        )
        SELECT
            COUNT(DISTINCT o.id) AS total_orders,
            SUM(o.total) AS total_sales,
            SUM(d.quantity) AS total_units_sold,
            p.product_name,
            SUM(p.product_total) AS product_sales
        FROM
            orders o
            JOIN order_details d ON o.id = d.order_id
            JOIN sales_summary p ON o.id = p.order_id
        GROUP BY
            p.product_name
        ORDER BY
            product_sales DESC;
        `;

        return sales;
    } catch (error) {
        console.log("error while getting sales report");
    }
}
