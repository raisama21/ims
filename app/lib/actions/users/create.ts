import sql from "~/app/db.server";
import * as argon from "argon2";
import z from "zod";
import { Users } from "~/app/lib/defitions";

export const CreateUserFormSchema = z.object({
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
    password: z
        .string()
        .trim()
        .min(1, { message: "password required" })
        .min(8, { message: "password must be at lease 8 character long" })
        .max(64, { message: "password must be at most 64 character long" }),
    roles: z.string().trim().min(1, { message: "roles required" }),
});

export async function validate(data: z.infer<typeof CreateUserFormSchema>) {
    const formFields = CreateUserFormSchema.safeParse(data);

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

    return {safeParse: formFields};
}

export default async function createUser(
    data: z.infer<typeof CreateUserFormSchema>,
    groupId: string
) {
    const { firstName, lastName, email, password, roles } = data;

    const hash = await argon.hash(password);

    try {
        await sql`
            INSERT INTO users (
                group_id,
                first_name, 
                last_name, 
                email, 
                password,
                roles
            )
            VALUES (
                ${groupId},
                ${firstName},
                ${lastName},
                ${email},
                ${hash},
                ${roles}
            )
        `;
    } catch (error: any) {
        console.log("error while creating user: ", error);
    }
}
