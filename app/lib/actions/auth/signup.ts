import sql from "~/database/connect";
import * as argon from "argon2";
import z from "zod";

export const SignupFormSchema = z.object({
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
    businessName: z
        .string()
        .trim()
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

export async function validate(data: z.infer<typeof SignupFormSchema>) {
    const formFields = SignupFormSchema.safeParse({
        firstName: data.firstName,
        lastName: data.lastName,
        businessName: data.businessName,
        email: data.email,
        password: data.password,
    });

    if (!formFields.success) {
        return {
            errors: formFields.error.flatten().fieldErrors,
        };
    }

    const { email, businessName } = formFields.data;

    const [user] = await sql<{ email: string }[]>`
        SELECT email FROM users WHERE email = ${email}
    `;

    const [group] = await sql<{ business_name: string }[]>`
        SELECT 
            groups.business_name 
        FROM users 
        INNER JOIN groups ON users.group_id = groups.id
        WHERE email = ${email}
    `;

    if (email === user?.email) {
        return {
            errors: {
                email: ["user already exists"],
            },
        };
    }

    if (businessName === group?.business_name) {
        return {
            errors: {
                businessName: ["business name already exists"],
            },
        };
    }
}

export default async function signup(data: z.infer<typeof SignupFormSchema>) {
    const { firstName, lastName, businessName, email, password } = data;

    const hash = await argon.hash(password);

    try {
        const [group] = await sql<{ id: string }[]>`
            INSERT INTO groups (business_name) VALUES (${businessName}) 
            RETURNING id;
        `;

        await sql`
            INSERT INTO users (
                group_id,
                first_name, 
                last_name, 
                email, 
                password
            )
            VALUES (
                ${group.id},
                ${firstName},
                ${lastName},
                ${email},
                ${hash}
            )
        `;
    } catch (error: any) {
        console.log("error while creating user: ", error);
    }
}
