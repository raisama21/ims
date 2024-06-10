import sql from "~/app/db.server";
import { Categories } from "~/app/lib/defitions";

export async function getAllCategories(groupId: string) {
    try {
        const categories = await sql<Categories[]>`
            SELECT * FROM categories WHERE group_id = ${groupId}
        `;

        return categories;
    } catch (error) {
        console.log("error while getting all categories: ", error);
    }
}
