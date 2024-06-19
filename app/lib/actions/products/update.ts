import sql from "~/app/db.server";
import z from "zod";
import { Products } from "~/app/lib/defitions";

export const EditProductsFormSchema = z.object({
    productName: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { message: "product name required" })
        .min(3, { message: "product name must be at least 3 character long" }),
    description: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { message: "description required" })
        .min(3, { message: "description must be at least 10 character long" }),
    category: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { message: "category required" }),
    status: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { message: "status required" }),
    stock: z
        .string()
        .min(1, { message: "required" })
        .transform((val) => parseInt(val, 10)),
    purchasePrice: z
        .string()
        .min(1, { message: "required" })
        .transform((val) => parseInt(val, 10)),
    sellingPrice: z
        .string()
        .min(1, { message: "required" })
        .transform((val) => parseInt(val, 10)),
});

export async function validate(
    data: z.infer<typeof EditProductsFormSchema>,
    groupId: string
) {
    const formFields = EditProductsFormSchema.safeParse(data);

    if (!formFields.success) {
        return {
            errors: formFields.error.flatten().fieldErrors,
        };
    }

    return { safeParse: formFields };
}

export default async function updateProduct(
    data: z.infer<typeof EditProductsFormSchema>,
    productId: string,
    groupId: string
) {
    const {
        productName,
        description,
        category,
        status,
        stock,
        purchasePrice,
        sellingPrice,
    } = data;

    try {
        await sql`
            UPDATE products SET 
                group_id = ${groupId},
                product_name = ${productName},
                description = ${description},
                category = ${category},
                status = ${status},
                stock = ${stock},
                purchase_price = ${purchasePrice},
                selling_price = ${sellingPrice}
            WHERE id = ${productId} AND group_id = ${groupId}
       `;
    } catch (error) {
        console.log("error while adding products: ", error);
    }
}
