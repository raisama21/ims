import sql from "~/app/db.server";
import z from "zod";

export const CreateOrdersFormSchema = z.object({
    product: z.array(
        z
            .string()
            .trim()
            .toLowerCase()
            .min(1, { message: "product name required" })
    ),
    quantity: z.array(
        z
            .string()
            .min(1, { message: "required" })
            .transform((val) => parseInt(val, 10))
    ),
    price: z.array(
        z
            .string()
            .min(1, { message: "required" })
            .transform((val) => parseInt(val, 10))
    ),
    subTotal: z
        .string()
        .min(1, { message: "reqired" })
        .transform((val) => parseInt(val, 10)),
    deliveryCharge: z
        .string()
        .transform((val) => parseInt(val, 10))
        .optional(),
    discount: z
        .string()
        .transform((val) => parseInt(val, 10))
        .optional(),
    total: z
        .string()
        .min(1, { message: "required" })
        .transform((val) => parseInt(val, 10)),
    customer: z.string().trim().min(1, { message: "select a customer" }),
});

export async function validate(data: z.infer<typeof CreateOrdersFormSchema>) {
    const formFields = CreateOrdersFormSchema.safeParse(data);

    if (!formFields.success) {
        return {
            errors: formFields.error.flatten().fieldErrors,
        };
    }

    return { safeParse: formFields };
}

export default async function createOrder(
    data: z.infer<typeof CreateOrdersFormSchema>,
    groupId: string
) {
    const [customer_address] = await sql<{ id: string }[]>`
        SELECT id FROM customer_address WHERE customer_id = ${data.customer}
    `;

    try {
        const [order] = await sql<{ id: string }[]>`
            INSERT INTO orders (
                group_id,
                customer_id,
                customer_address_id,
                sub_total,
                delivery_charge,
                discount_in_percentage,
                total
            )
            VALUES (
                ${groupId},
                ${data.customer},
                ${customer_address.id},
                ${data.subTotal},
                ${data.deliveryCharge ?? 0},
                ${data.discount ?? 0},
                ${data.total}
            )
            RETURNING id
        `;

        for (let i = 0; i < data.product.length; i++) {
            await sql`
               INSERT INTO "order_details" (
                   order_id,
                   product_name,
                   quantity,
                   price
               ) 
               VALUES (
                   ${order.id},
                   ${data.product[i]},
                   ${data.quantity[i]},
                   ${data.price[i]}
               )
            `;
        }

        await sql`
            INSERT INTO "order_tracking" (
                group_id,
                order_id,
                customer_id
            )
            VALUES (
                ${groupId},
                ${order.id},
                ${data.customer}
            )
        `;
    } catch (error) {
        console.log("error while creating order: ", error);
    }
}
