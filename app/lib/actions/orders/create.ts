import sql from "~/database/connect";
import z from "zod";

export const CreateOrdersFormSchema = z.object({
    product: z.array(
        z.string().trim().min(1, { message: "product name required" })
    ),
    quantity: z.array(
        z
            .string()
            .min(1, { message: " required" })
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
    paymentMethod: z.string().trim().min(1, { message: "required" }),
    paymentId: z.string().min(1, { message: "required" }),
    streetAddress: z
        .string()
        .trim()
        .min(1, { message: "street address required" })
        .min(10, {
            message: "provide proper street address with nearby land mark",
        }),
    city: z
        .string()
        .trim()
        .min(1, { message: "city name required" })
        .min(3, { message: "city name must be longer than 3 character" }),
    provience: z
        .string()
        .trim()
        .min(1, { message: "provience required" })
        .min(3, { message: "provience must be longer than 3 character" }),
    postalCode: z
        .string()
        .min(1, { message: "street address required" })
        .min(5, { message: "postal code are 5 character" })
        .transform((val) => parseInt(val, 10)),
});

export async function validate(data: z.infer<typeof CreateOrdersFormSchema>) {
    const formFields = CreateOrdersFormSchema.safeParse({
        product: data.product,
        quantity: data.quantity,
        subTotal: data.subTotal,
        deliveryCharge: data.deliveryCharge,
        discount: data.deliveryCharge,
        total: data.total,
        customer: data.customer,
        paymentMethod: data.paymentMethod,
        paymentId: data.paymentId,
        streetAddress: data.streetAddress,
        city: data.city,
        provience: data.provience,
        postalCode: data.postalCode,
    });

    if (!formFields.success) {
        return {
            errors: formFields.error.flatten().fieldErrors,
        };
    }
}

export default async function createOrder(
    data: z.infer<typeof CreateOrdersFormSchema>,
    groupId: string
) {
    try {
        const [order] = await sql<{ id: string }[]>`
            INSERT INTO orders (
                group_id,
                customer_id,
                sub_total,
                delivery_charge,
                discount_in_percentage,
                total,
                street_address,
                city,
                provience,
                postal_code,
                payment_method,
                payment_id
            )
            VALUES (
                ${groupId},
                ${data.customer},
                ${data.subTotal},
                ${data.deliveryCharge ?? 0},
                ${data.discount ?? 0},
                ${data.total},
                ${data.streetAddress},
                ${data.city},
                ${data.provience},
                ${data.postalCode},
                ${data.paymentMethod},
                ${data.paymentId}
            )
            RETURNING id
        `;

        for (let i = 0; i < data.product.length; i++) {
            await sql`
               INSERT INTO "product-order-details" (
                   order_id,
                   product_name,
                   quantity
               ) 
               VALUES (
                   ${order.id},
                   ${data.product[i]},
                   ${data.quantity[i]}
               )
            `;
        }
    } catch (error) {
        console.log("error while creating order: ", error);
    }
}
