import sql from "~/app/db.server";

export default async function updateOrderTracking(
    orderId: string,
    groupId: string,
    status: "order_created" | "processing" | "shipped" | "delivered",
    column_name: "created_at" | "processed_at" | "shipped_at" | "delivered_at"
) {
    const date = new Date().toISOString();

    try {
        await sql`
            UPDATE order_tracking SET 
                status = ${status},
                ${sql(column_name)} = ${date}
            WHERE order_id = ${orderId} AND group_id = ${groupId}
        `;
    } catch (error) {
        console.log("error while updating 'order_tracking': ", error);
    }
}
