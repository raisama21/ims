import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/app/components/ui/card";
import { Label } from "~/app/components/ui/label";
import { Input } from "~/app/components/ui/input";
import { Button } from "~/app/components/ui/button";

import { getSession, productCategoriesCookie } from "~/app/cookie.server";
import CategoriesTable from "./table";
import createCategories, {
    CreateCategoriesFormSchema,
    validate,
} from "~/app/lib/actions/categories/create";
import { getAllCategories } from "~/app/lib/data/categories";

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request);
    if (session.roles === "sales-person") {
        return;
    }

    const formData = await request.formData();
    const categoriesData = Object.fromEntries(formData) as z.infer<
        typeof CreateCategoriesFormSchema
    >;

    const errors = await validate(categoriesData, session.groupId);
    if (errors) {
        return json({ state: errors });
    }

    await createCategories(categoriesData, session.groupId);

    return null;
}

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    if (!session) {
        return;
    }

    const categories = await getAllCategories(session.groupId);
    if (!categories) {
        return;
    }

    return json({ categories });
}

export default function Categories() {
    const actionData = useActionData<typeof action>();
    const loaderData = useLoaderData<typeof loader>();

    return (
        <main className="px-8">
            <div className="mx-auto grid max-w-[59rem] grid-cols-[repeat(3,1fr)] items-start gap-4">
                <Form method="POST" className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Categories</CardTitle>
                            <CardDescription>
                                Create your categories here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="categoryName">
                                        Category Name
                                    </Label>
                                    <Input
                                        id="categoryName"
                                        type="text"
                                        name="categoryName"
                                    />
                                    {actionData?.state?.errors.categoryName && (
                                        <div>
                                            <p className="pl-2 text-xs font-medium text-red-500">
                                                {
                                                    actionData.state.errors
                                                        .categoryName[0]
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end gap-2">
                        <Button size="sm">Create User</Button>
                    </div>
                </Form>
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>
                            Manage your categories here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CategoriesTable categories={loaderData.categories} />
                    </CardContent>
                    <CardFooter>
                        <div className="text-xs text-muted-foreground">
                            Showing <strong>5</strong> of <strong>5</strong>{" "}
                            categories
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}
