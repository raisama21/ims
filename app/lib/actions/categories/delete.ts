import sql from "~/app/db.server";

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
