import sql from "~/app/db.server";
import * as argon from "argon2";
import z from "zod";
import { Users } from "~/app/lib/defitions";

export const LoginFormSchema = z.object({
    businessName: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { message: "business name required" })
        .min(3, { message: "business name must be at lease 3 character long" }),
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
});

export async function validate(data: z.infer<typeof LoginFormSchema>) {
    const formField = LoginFormSchema.safeParse(data);

    if (!formField.success) {
        return {
            errors: formField.error.flatten().fieldErrors,
        };
    }

    const { businessName, email, password } = formField.data;

    const [result] = await sql<
        { business_name: string; email: string; password: string }[]
    >`
        SELECT 
            groups.business_name, 
            users.email, 
            users.password 
        FROM users INNER JOIN groups ON users.group_id = groups.id
        WHERE email = ${email}
    `;

    if (email !== result?.email) {
        return {
            errors: {
                email: ["email or password is wrong"],
                password: ["email or password is wrong"],
            },
        };
    }

    if (businessName !== result?.business_name) {
        return {
            errors: {
                businessName: ["business name do not match"],
            },
        };
    }

    const verify = await argon.verify(result.password, password);

    if (!verify) {
        return {
            errors: {
                email: ["email or password is wrong"],
                password: ["email or password is wrong"],
            },
        };
    }

    return { safeParse: formField };
}

export default async function authentication(
    data: z.infer<typeof LoginFormSchema>
) {
    const { email } = data;

    const [user] = await sql<Users[]>`
        SELECT id, group_id, roles FROM users WHERE email = ${email}
    `;

    return {
        userId: user.id,
        groupId: user.group_id,
        roles: user.roles,
    };
}
