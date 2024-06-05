import sql from "~/database/connect";
import { Users } from "~/app/lib/defitions";

export async function getAllUser(groupId: string) {
    try {
        const users = await sql<Users[]>`
            SELECT 
                id,
                group_id,
                first_name,
                last_name,
                email,
                roles
            FROM users WHERE group_id = ${groupId}
       `;

        return users;
    } catch (error) {
        console.log("error while getting all 'users': ", error);
    }
}

export async function getOneUser(userId: string, groupId: string) {
    try {
        const [user] = await sql<Users[]>`
            SELECT 
                id,
                group_id,
                first_name,
                last_name,
                email,
                password,
                roles
            FROM users WHERE id = ${userId} AND group_id = ${groupId}
       `;

        return user;
    } catch (error) {
        console.log("error while getting one 'users': ", error);
    }
}
