import sql from "~/database/connect";
import * as argon from "argon2";
import z from "zod";
import { Users } from "~/app/lib/defitions";

export const UpdateUserFormSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, { message: "first name required" })
        .min(3, { message: "first name must be at lease 3 character long" }),
    lastName: z
        .string()
        .trim()
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
    roles: z
        .string()
        .trim()
        .min(1, { message: "roles required" }),
});

export async function validate(data: z.infer<typeof UpdateUserFormSchema>) {
    const formFields = UpdateUserFormSchema.safeParse({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        roles: data.roles,
    });

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
}

export default async function updateUser(
    data: z.infer<typeof UpdateUserFormSchema>,
    groupId: string
) {
    const { firstName, lastName, email, password, roles } = data;

    const hash = await argon.hash(password);

    try {
        await sql`
            UPDATE users SET 
                first_name = ${firstName}, 
                last_name = ${lastName}, 
                email = ${email}, 
                password = ${hash},
                roles = ${roles}
            WHERE groupId = ${groupId}
        `;
    } catch (error: any) {
        console.log("error while creating user: ", error);
    }
}
