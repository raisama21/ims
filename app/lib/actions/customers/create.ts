import sql from "~/database/connect";
import z from "zod";
import { Customers } from "~/app/lib/defitions";

export const AddCustomersFormSchema = z.object({
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
    phoneNumber: z.number().min(1, { message: "password required" }),
});

export async function validate(
    data: z.infer<typeof AddCustomersFormSchema>,
    groupId: string
) {
    const formFields = AddCustomersFormSchema.safeParse({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
    });

    if (!formFields.success) {
        return {
            errors: formFields.error.flatten().fieldErrors,
        };
    }

    const { email } = formFields.data;

    const [customer] = await sql<Customers[]>`
        SELECT email FROM customers WHERE email = ${email} AND group_id = ${groupId}
    `;

    if (email === customer?.email) {
        return {
            errors: {
                email: ["customer already exists"],
            },
        };
    }
}

export default async function createCustomers(
    data: z.infer<typeof AddCustomersFormSchema>,
    groupId: string
) {
    const { firstName, lastName, email, phoneNumber } = data;

    try {
        await sql`
            INSERT INTO customers (
                group_id,
                first_name, 
                last_name, 
                email, 
                phone_number
            )
            VALUES (
                ${groupId},
                ${firstName},
                ${lastName},
                ${email},
                ${phoneNumber}
            )
        `;
    } catch (error: any) {
        console.log("error while adding customers: ", error);
    }
}
