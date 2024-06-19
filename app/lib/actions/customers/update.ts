import sql from "~/app/db.server";
import z from "zod";

export const UpdateCustomersFormSchema = z.object({
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
    streetAddress: z.string().trim().toLowerCase().optional(),
    city: z.string().trim().toLowerCase().optional(),
    provience: z.string().trim().toLowerCase().optional(),
    postalCode: z
        .string()
        .transform((val) => parseInt(val, 10))
        .optional(),
});

export async function validate(
    data: z.infer<typeof UpdateCustomersFormSchema>
) {
    const formFields = UpdateCustomersFormSchema.safeParse(data);

    if (!formFields.success) {
        return {
            errors: formFields.error.flatten().fieldErrors,
        };
    }

    return { safeParse: formFields };
}

export default async function updateCustomer(
    data: z.infer<typeof UpdateCustomersFormSchema>,
    groupId: string,
    customerId: string
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
        await sql`
            UPDATE customers SET
                first_name = ${firstName},
                last_name = ${lastName},
                email = ${email},
                phone_number = ${phoneNumber}
            WHERE id = ${customerId} AND group_id = ${groupId}
        `;

        await sql`
            UPDATE customer_address SET
                street_address = ${streetAddress ?? ""},
                city = ${city ?? ""},
                provience = ${provience ?? ""},
                postal_code = ${postalCode ?? 0}
            WHERE customer_id = ${customerId ?? ""}
        `;
    } catch (error: any) {
        console.log("error while updating customers: ", error);
    }
}
