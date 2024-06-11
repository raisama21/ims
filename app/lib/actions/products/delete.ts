import sql from "~/app/db.server";

export default async function deleteProduct(
    productId: string,
    groupId: string
) {
    try {
        await sql`
            DELETE FROM products 
            WHERE id = ${productId} AND group_id = ${groupId}
        `;
    } catch (error) {
        console.log("error while deleting 'product': ", error);
    }
}
