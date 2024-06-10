import sql from "~/app/db.server";
import z from "zod";

export const CreateCategoriesFormSchema = z.object({
    categoryName: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { message: "categories name required" })
        .min(3, {
            message: "categories name must be at lease 3 character long",
        }),
});

export async function validate(
    data: z.infer<typeof CreateCategoriesFormSchema>,
    groupId: string
) {
    const formFields = CreateCategoriesFormSchema.safeParse(data);

    if (!formFields.success) {
        return {
            errors: formFields.error.flatten().fieldErrors,
        };
    }

    const { categoryName } = formFields.data;

    const [category] = await sql<{ category_name: string }[]>`
        SELECT 
            category_name 
        FROM 
            categories 
        WHERE category_name = ${categoryName} AND group_id = ${groupId}
    `;

    if (category?.category_name === categoryName) {
        return {
            errors: {
                categoryName: ["category name already exists"],
            },
        };
    }

    return { safeParse: formFields };
}

export default async function createCategories(
    data: z.infer<typeof CreateCategoriesFormSchema>,
    groupId: string
) {
    try {
        await sql`
            INSERT INTO categories (group_id, category_name)  
            VALUES (${groupId}, ${data.categoryName})
        `;
    } catch (error) {
        console.log("error while creating categories: ", error);
    }
}
