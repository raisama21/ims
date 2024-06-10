import sql from "~/app/db.server";
import z from "zod";
import { Customers } from "~/app/lib/defitions";

export const AddCustomersFormSchema = z.object({
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
    phoneNumber: z
        .string()
        .min(1, { message: "phone number required" })
        .transform((val) => parseInt(val, 10)),
    streetAddress: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { message: "street address required" }),
    city: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { message: "city name required" }),
    provience: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { message: "provience name required" }),
    postalCode: z
        .string()
        .min(1, { message: "postal code required" })
        .transform((val) => parseInt(val, 10)),
});

export async function validate(
    data: z.infer<typeof AddCustomersFormSchema>,
    groupId: string
) {
    const formFields = AddCustomersFormSchema.safeParse(data);

    if (!formFields.success) {
        return {
            errors: formFields.error.flatten().fieldErrors,
        };
    }

    const { email } = formFields.data;

    const [customer] = await sql<Customers[]>`
        SELECT email FROM customers 
        WHERE email = ${email} AND group_id = ${groupId}
    `;

    if (email === customer?.email) {
        return {
            errors: {
                email: ["customer already exists"],
            },
        };
    }

    return { safeParse: formFields };
}

export default async function createCustomers(
    data: z.infer<typeof AddCustomersFormSchema>,
    groupId: string
) {
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        streetAddress,
        city,
        provience,
        postalCode,
    } = data;

    try {
        const [customer] = await sql<{ id: string }[]>`
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
            RETURNING id
        `;

        await sql`
            INSERT INTO customer_address (
                customer_id,
                street_address,
                city,
                provience,
                postal_code
            )
            VALUES (
                ${customer.id},
                ${streetAddress},
                ${city},
                ${provience},
                ${postalCode}
            )
        `;
    } catch (error: any) {
        console.log("error while adding customers: ", error);
    }
}
