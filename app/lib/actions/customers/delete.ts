import sql from "~/database/connect";

export default async function deleteCustomer(
    customerId: string,
    groupId: string
) {
    try {
        await sql`
            DELETE FROM customers 
            WHERE id = ${customerId} AND group_id = ${groupId}
        `;
    } catch (error) {
        console.log("error while deleting customer: ", error);
    }
}
