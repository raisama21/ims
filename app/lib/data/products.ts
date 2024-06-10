import sql from "~/app/db.server";

import { Products } from "~/app/lib/defitions";

export async function getAllProducts(groupId: string) {
    try {
        const products = await sql<Products[]>`
            SELECT * FROM products WHERE group_id = ${groupId}
        `;

        return products;
    } catch (error) {
        console.log("error while getting all products: ", error);
    }
}
