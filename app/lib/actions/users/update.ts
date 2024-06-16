import sql from "~/app/db.server";
import z from "zod";
import { Users } from "~/app/lib/defitions";

export const UpdateUserFormSchema = z.object({
    firstName: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { message: "first name required" })
        .min(3, { message: "first name must be at lease 3 character long" }),
    lastName: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { message: "last name required" })
        .min(3, { message: "last name must be at lease 3 character long" }),
    email: z
        .string()
        .trim()
        .min(1, { message: "email required" })
        .email({ message: "invalid email" }),
    roles: z.string().trim().min(1, { message: "roles required" }),
});

export async function validate(data: z.infer<typeof UpdateUserFormSchema>) {
    const formFields = UpdateUserFormSchema.safeParse(data);

    if (!formFields.success) {
        return {
            errors: formFields.error.flatten().fieldErrors,
        };
    }

    const { email } = formFields.data;

    const [user] = await sql<Users[]>`
        SELECT * FROM users WHERE email = ${email}
    `;

    if (email === user?.email) {
        return {
            errors: {
                email: ["user already exists"],
            },
        };
    }

    return { safeParse: formFields };
}

export default async function updateUser(
    data: z.infer<typeof UpdateUserFormSchema>,
    groupId: string,
    userId: string
) {
    const { firstName, lastName, email, roles } = data;

    try {
        await sql`
            UPDATE users SET 
                first_name = ${firstName},
                last_name = ${lastName},
                email = ${email},
                roles = ${roles}
            WHERE group_id = ${groupId} AND id = ${userId}
        `;
    } catch (error: any) {
        console.log("error while updating user: ", error);
    }
}
