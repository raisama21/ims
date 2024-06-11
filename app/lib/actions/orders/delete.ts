import sql from "~/app/db.server";

export default async function deleteOrder(orderId: string, groupId: string) {
    try {
        await sql`
            DELETE FROM order_details WHERE order_id = ${orderId} 
        `;

        await sql`
            DELETE FROM order_tracking 
            WHERE order_id = ${orderId} AND group_id = ${groupId}
        `;

        await sql`
            DELETE FROM orders 
            WHERE id = ${orderId} AND group_id = ${groupId}
        `;
    } catch (error) {
        console.log("error while deleting 'order': ", error);
    }
}
