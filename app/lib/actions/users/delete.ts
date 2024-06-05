import sql from "~/database/connect";

export default async function deleteUser(userId: string, groupId: string) {
    try {
        const [user] = await sql<
            { roles: "admin" | "product-manager" | "sales-person" }[]
        >`
            SELECT roles FROM users WHERE id = ${userId} AND group_id = ${groupId} 
        `;

        if (user.roles === "admin") {
            return { isAdmin: true };
        }

        await sql`
            DELETE FROM users WHERE id = ${userId} AND group_id = ${groupId}
       `;
    } catch (error) {
        console.log("error while deleting user: ", error);
    }
}
