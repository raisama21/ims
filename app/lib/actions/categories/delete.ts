import sql from "~/database/connect";

export default async function deleteCategory(
    categoryId: string,
    groupId: string
) {
    try {
        await sql`
            DELETE FROM 
                categories
            WHERE id = ${categoryId} AND group_id = ${groupId}
       `;
    } catch (error) {
        console.log("error while deleting category: ", error);
    }
}
