import sql from "~/database/connect";
import z from "zod";

export const UpdateCustomersFormSchema = z.object({
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
    data: z.infer<typeof UpdateCustomersFormSchema>
) {
    const formFields = UpdateCustomersFormSchema.safeParse({
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
}

export default async function updateCustomers(
    data: z.infer<typeof UpdateCustomersFormSchema>,
    customerId: string,
    groupId: string
) {
    const { firstName, lastName, email, phoneNumber } = data;

    try {
        await sql`
            UPDATE customers SET 
                first_name = ${firstName}, 
                last_name = ${lastName}, 
                email = ${email}, 
                phone_number = ${phoneNumber}
            WHERE id = ${customerId} AND group_id = ${groupId}
            
        `;
    } catch (error: any) {
        console.log("error while adding customers: ", error);
    }
}
