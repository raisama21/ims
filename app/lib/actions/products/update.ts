import sql from "~/app/db.server";
import z from "zod";
import { Products } from "~/app/lib/defitions";

export const UpdateProductsFormSchema = z.object({
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
    data: z.infer<typeof UpdateProductsFormSchema>,
    groupId: string
) {
    const formFields = UpdateProductsFormSchema.safeParse(data);

    if (!formFields.success) {
        return {
            errors: formFields.error.flatten().fieldErrors,
        };
    }

    const { productName } = formFields.data;

    const [product] = await sql<Products[]>`
        SELECT product_name FROM products 
        WHERE product_name = ${productName} AND group_id = ${groupId}
    `;

    if (product?.product_name === productName) {
        return {
            errors: {
                productName: ["product already exists"],
            },
        };
    }
}

export default async function updateProduct(
    data: z.infer<typeof UpdateProductsFormSchema>,
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
            INSERT INTO products (
                group_id,
                product_name,
                description,
                category,
                status,
                stock,
                purchase_price,
                selling_price
            ) 
            VALUES (
                ${groupId},
                ${productName},
                ${description},
                ${category},
                ${status},
                ${stock},
                ${purchasePrice},
                ${sellingPrice}
            )
       `;
    } catch (error) {
        console.log("error while adding products: ", error);
    }
}
