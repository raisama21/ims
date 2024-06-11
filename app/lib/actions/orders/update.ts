import sql from "~/app/db.server";
import z from "zod";

export const EditOrdersFormSchema = z.object({
    paymentId: z
        .string()
        .min(1, { message: "reqired" })
        .transform((val) => parseInt(val, 10)),
    status: z.string().trim().min(1, { message: "select a status" }),
    paymentMethod: z
        .string()
        .trim()
        .min(1, { message: "select a payment method" }),
});

export async function validate(data: z.infer<typeof EditOrdersFormSchema>) {
    const formFields = EditOrdersFormSchema.safeParse(data);

    if (!formFields.success) {
        return {
            errors: formFields.error.flatten().fieldErrors,
        };
    }

    return { safeParse: formFields };
}

export default async function updateOrder(
    data: z.infer<typeof EditOrdersFormSchema>,
    orderId: string
) {
    const { paymentMethod, paymentId, status } = data;
    try {
        await sql`
            UPDATE payments SET
                payment_method = ${paymentMethod},
                payment_id = ${paymentId},
                status = ${status}
            WHERE order_id = ${orderId}
       `;
    } catch (error) {
        console.log("error while updating 'order': ", error);
    }
}
