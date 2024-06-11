import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Link, Form, useLoaderData, useActionData } from "@remix-run/react";
import z from "zod";

import { ChevronLeft, Upload } from "lucide-react";

import { Button } from "~/app/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/app/components/ui/card";
import { Input } from "~/app/components/ui/input";
import { Label } from "~/app/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/app/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/app/components/ui/table";
import { Textarea } from "~/app/components/ui/textarea";
import { getSession } from "~/app/cookie.server";
import updateProduct, {
    EditProductsFormSchema,
    validate,
} from "~/app/lib/actions/products/update";
import { getAllCategories } from "~/app/lib/data/categories";
import { getProductDetails } from "~/app/lib/data/products";
import invariant from "tiny-invariant";

/**
 * generate sku based on category
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
    invariant(params.productId, "param productId not found");
    const session = await getSession(request);
    if (!session) {
        return;
    }

    const [categories, details] = await Promise.all([
        await getAllCategories(session.groupId),
        await getProductDetails(params.productId, session.groupId),
    ]);
    if (!categories && !details) {
        return;
    }

    return json({ categories, details });
}

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.productId, "param productId not found");
    const session = await getSession(request);
    if (session.roles === "sales-person") {
        return;
    }

    const formData = await request.formData();
    const productData = Object.fromEntries(formData) as unknown as z.infer<
        typeof EditProductsFormSchema
    >;

    const { safeParse, errors } = await validate(productData, session.groupId);
    if (errors) {
        return json({ errors });
    }

    await updateProduct(safeParse.data, params.productId, session.groupId);

    return redirect("/dashboard/products");
}

export default function Add() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Form
                method="POST"
                className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
            >
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/products">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Button>
                    </Link>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Link to="/dashboard/products">
                            <Button variant="outline" size="sm">
                                Discard
                            </Button>
                        </Link>
                        <Button size="sm" type="submit">
                            Save Product
                        </Button>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-0">
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                                <CardDescription></CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="productName">
                                            Name
                                        </Label>
                                        <Input
                                            id="productName"
                                            type="text"
                                            name="productName"
                                            className="w-full"
                                            placeholder="Huawei MatePad T8"
                                            defaultValue={
                                                loaderData.details?.product_name
                                            }
                                        />
                                        {actionData?.errors.productName && (
                                            <div>
                                                <p className="pl-2 text-xs font-medium text-red-500">
                                                    {
                                                        actionData?.errors
                                                            .productName[0]
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            className="min-h-32"
                                            placeholder="It comes equipped with an octa-core chipset, which ensures that you can enjoy faster processing so that you can complete your tasks with ease"
                                            defaultValue={
                                                loaderData.details?.description
                                            }
                                        />
                                        {actionData?.errors.description && (
                                            <div>
                                                <p className="pl-2 text-xs font-medium text-red-500">
                                                    {
                                                        actionData?.errors
                                                            .description[0]
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card x-chunk="dashboard-07-chunk-1">
                            <CardHeader>
                                <CardTitle>Stock</CardTitle>
                                <CardDescription>
                                    Lipsum dolor sit amet, consectetur
                                    adipiscing elit
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">
                                                SKU
                                            </TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead>
                                                Purchase Price
                                            </TableHead>
                                            <TableHead>Selling Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-semibold">
                                                GGPC-001
                                            </TableCell>
                                            <TableCell>
                                                <Label
                                                    htmlFor="stock"
                                                    className="sr-only"
                                                >
                                                    Stock
                                                </Label>
                                                <Input
                                                    id="stock"
                                                    type="number"
                                                    name="stock"
                                                    placeholder="10"
                                                    defaultValue={
                                                        loaderData.details
                                                            ?.stock
                                                    }
                                                />
                                                {actionData?.errors.stock && (
                                                    <div>
                                                        <p className="pl-2 text-xs font-medium text-red-500">
                                                            {
                                                                actionData
                                                                    ?.errors
                                                                    .stock[0]
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Label
                                                    htmlFor="purchasePrice"
                                                    className="sr-only"
                                                >
                                                    Price
                                                </Label>
                                                <Input
                                                    id="purchasePrice"
                                                    type="number"
                                                    name="purchasePrice"
                                                    placeholder="14000"
                                                    defaultValue={
                                                        loaderData.details
                                                            ?.purchase_price
                                                    }
                                                />
                                                {actionData?.errors
                                                    .purchasePrice && (
                                                    <div>
                                                        <p className="pl-2 text-xs font-medium text-red-500">
                                                            {
                                                                actionData
                                                                    ?.errors
                                                                    .purchasePrice[0]
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Label
                                                    htmlFor="sellingPrice"
                                                    className="sr-only"
                                                >
                                                    Price
                                                </Label>
                                                <Input
                                                    id="sellingPrice"
                                                    type="number"
                                                    name="sellingPrice"
                                                    placeholder="18800"
                                                    defaultValue={
                                                        loaderData.details
                                                            ?.selling_price
                                                    }
                                                />
                                                {actionData?.errors
                                                    .sellingPrice && (
                                                    <div>
                                                        <p className="pl-2 text-xs font-medium text-red-500">
                                                            {
                                                                actionData
                                                                    ?.errors
                                                                    .sellingPrice[0]
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card x-chunk="dashboard-07-chunk-2">
                            <CardHeader>
                                <CardTitle>Product Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-3">
                                    <div className="grid gap-3">
                                        <Label htmlFor="category">
                                            Category
                                        </Label>
                                        <Select name="category">
                                            <SelectTrigger
                                                id="category"
                                                aria-label="Select category"
                                            >
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {loaderData.categories.map(
                                                    (category) => {
                                                        return (
                                                            <SelectItem
                                                                className="capitalize"
                                                                value={
                                                                    category.category_name
                                                                }
                                                                key={
                                                                    category.id
                                                                }
                                                            >
                                                                {
                                                                    category.category_name
                                                                }
                                                            </SelectItem>
                                                        );
                                                    }
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {actionData?.errors.category && (
                                            <div>
                                                <p className="pl-2 text-xs font-medium text-red-500">
                                                    {
                                                        actionData?.errors
                                                            .category[0]
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-3">
                            <CardHeader>
                                <CardTitle>Product Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="status">Status</Label>
                                        <Select name="status">
                                            <SelectTrigger
                                                id="status"
                                                aria-label="Select status"
                                            >
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="in-stock">
                                                    In stock
                                                </SelectItem>
                                                <SelectItem value="out-of-stock">
                                                    Out of stock
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {actionData?.errors.status && (
                                            <div>
                                                <p className="pl-2 text-xs font-medium text-red-500">
                                                    {
                                                        actionData?.errors
                                                            .status[0]
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card
                            className="overflow-hidden"
                            x-chunk="dashboard-07-chunk-4"
                        >
                            <CardHeader>
                                <CardTitle>Product Images</CardTitle>
                                <CardDescription>
                                    Lipsum dolor sit amet, consectetur
                                    adipiscing elit
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    <img
                                        alt="Product image"
                                        className="aspect-square w-full rounded-md object-cover"
                                        height="300"
                                        src="/placeholder.svg"
                                        width="300"
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <button>
                                            <img
                                                alt="Product image"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="84"
                                                src="/placeholder.svg"
                                                width="84"
                                            />
                                        </button>
                                        <button>
                                            <img
                                                alt="Product image"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="84"
                                                src="/placeholder.svg"
                                                width="84"
                                            />
                                        </button>
                                        <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                                            <Upload className="h-4 w-4 text-muted-foreground" />
                                            <span className="sr-only">
                                                Upload
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 md:hidden">
                    <Link to="/dashboard/products">
                        <Button variant="outline" size="sm">
                            Discard
                        </Button>
                    </Link>
                    <Button size="sm" type="submit">
                        Save Product
                    </Button>
                </div>
            </Form>
        </main>
    );
}
