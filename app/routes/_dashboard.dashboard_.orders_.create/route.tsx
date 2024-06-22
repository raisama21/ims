import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
    Link,
    Form,
    useLoaderData,
    useActionData,
    useSearchParams,
} from "@remix-run/react";

import { ChevronLeft } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Button } from "~/app/components/ui/button";
import {
    Card,
    CardContent,
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

import { getSession } from "~/app/cookie.server";
import { getAllCustomers } from "~/app/lib/data/customers";
import { getAllProducts } from "~/app/lib/data/products";
import createOrder, {
    CreateOrdersFormSchema,
    validate,
} from "~/app/lib/actions/orders/create";
import { z } from "zod";
import { calculateNetAmount } from "./utils";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    if (!session) {
        return;
    }

    const [products, customers] = await Promise.all([
        await getAllProducts(session.groupId),
        await getAllCustomers(session.groupId),
    ]);

    if (!products && !customers) {
        return;
    }

    return json({ products, customers });
}

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request);
    if (session.roles === "sales-person") {
        return;
    }

    const formData = await request.formData();
    const orderData = {
        product: formData.getAll("product"),
        quantity: formData.getAll("quantity"),
        sellingPrice: formData.getAll("sellingPrice"),
        purchasePrice: formData.getAll("purchasePrice"),
        subTotal: formData.get("subTotal"),
        total: formData.get("total"),
        customer: formData.get("customer"),
        deliveryCharge: formData.get("deliveryCharge"),
        discount: formData.get("discount"),
    } as unknown as z.infer<typeof CreateOrdersFormSchema>;

    const { safeParse, errors } = await validate(orderData);
    if (errors) {
        return json({ errors });
    }

    await createOrder(safeParse.data, session.groupId);

    return redirect("/dashboard/orders");
}

export default function Create() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();

    const [searchParam, setSearchParams] = useSearchParams();

    const [products, setProduct] = useState<string[]>([]);
    const selectedProducts = loaderData.products?.filter((product) => {
        return products.includes(product.product_name);
    });

    if (!selectedProducts) {
        return;
    }

    let subTotal = 0;
    for (const product of selectedProducts) {
        const quantity = Number(
            searchParam.get(`${product.product_name}_quantity`)
        );

        subTotal += product.selling_price * quantity;
    }

    const discount = Number(searchParam.get("discount"));
    const deliveryCharge = Number(searchParam.get("deliveryCharge"));

    const total = calculateNetAmount(subTotal, discount, deliveryCharge);

    return (
        <main className="px-8">
            <Form method="POST" className="mx-auto grid max-w-[59rem] gap-6">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/orders">
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
                        <Link to="/dashboard/orders">
                            <Button variant="outline" size="sm">
                                Discard
                            </Button>
                        </Link>
                        <Button size="sm" type="submit">
                            Save Product
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {selectedProducts?.map((product) => {
                                return (
                                    <div
                                        className="grid grid-cols-[repeat(3,1fr)] gap-3"
                                        key={product.id}
                                    >
                                        <div>
                                            <Label htmlFor="product">
                                                Product name
                                            </Label>
                                            <Input
                                                id="product"
                                                type="text"
                                                name="product"
                                                defaultValue={
                                                    product.product_name
                                                }
                                            />
                                            {actionData?.errors.product && (
                                                <div>
                                                    <p className="pl-2 text-xs font-medium text-red-500">
                                                        {
                                                            actionData?.errors
                                                                .product[0]
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="sellingPrice">
                                                Product price
                                            </Label>
                                            <Input
                                                id="sellingPrice"
                                                type="number"
                                                name="sellingPrice"
                                                defaultValue={
                                                    product.selling_price
                                                }
                                            />
                                            {actionData?.errors
                                                .sellingPrice && (
                                                <div>
                                                    <p className="pl-2 text-xs font-medium text-red-500">
                                                        {
                                                            actionData?.errors
                                                                .sellingPrice[0]
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="hidden">
                                            <Label htmlFor="purchasePrice">
                                                Product purchase price
                                            </Label>
                                            <Input
                                                id="purchasePrice"
                                                type="number"
                                                name="purchasePrice"
                                                defaultValue={
                                                    product.purchase_price
                                                }
                                            />
                                            {actionData?.errors
                                                .purchasePrice && (
                                                <div>
                                                    <p className="pl-2 text-xs font-medium text-red-500">
                                                        {
                                                            actionData?.errors
                                                                .purchasePrice[0]
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="quantity">
                                                Product quantity
                                            </Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                name="quantity"
                                                onChange={(
                                                    e: ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    setSearchParams(
                                                        (prev) => {
                                                            prev.set(
                                                                `${product.product_name}_quantity`,
                                                                e.target.value
                                                            );

                                                            return prev;
                                                        },
                                                        {
                                                            preventScrollReset:
                                                                true,
                                                        }
                                                    );
                                                }}
                                            />
                                            {actionData?.errors.quantity && (
                                                <div>
                                                    <p className="pl-2 text-xs font-medium text-red-500">
                                                        {
                                                            actionData?.errors
                                                                .quantity[0]
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="grid gap-3">
                                <Label htmlFor="product">Product</Label>
                                <Select
                                    onValueChange={(value) =>
                                        setProduct((prevState) => {
                                            return prevState.includes(value)
                                                ? prevState
                                                : [...prevState, value];
                                        })
                                    }
                                >
                                    <SelectTrigger
                                        id="product"
                                        aria-label="Select product"
                                    >
                                        <SelectValue placeholder="Select Product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loaderData.products?.map((product) => {
                                            return (
                                                <SelectItem
                                                    key={product.id}
                                                    className="capitalize"
                                                    value={product.product_name}
                                                >
                                                    {product.product_name}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="subTotal">Sub Total</Label>
                                <Input
                                    id="subTotal"
                                    type="number"
                                    placeholder="9000"
                                    name="subTotal"
                                    value={subTotal}
                                />
                                {actionData?.errors.subTotal && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.errors.subTotal[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="deliveryCharge">
                                    Delivery charge
                                </Label>
                                <Input
                                    id="deliveryCharge"
                                    type="number"
                                    name="deliveryCharge"
                                    placeholder="1000"
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => {
                                        setSearchParams(
                                            (prev) => {
                                                prev.set(
                                                    "deliveryCharge",
                                                    e.target.value
                                                );

                                                return prev;
                                            },
                                            { preventScrollReset: true }
                                        );
                                    }}
                                />
                                {actionData?.errors.deliveryCharge && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.errors
                                                    .deliveryCharge[0]
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="discount">Discount</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    name="discount"
                                    placeholder="10%"
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => {
                                        setSearchParams(
                                            (prev) => {
                                                prev.set(
                                                    "discount",
                                                    e.target.value
                                                );

                                                return prev;
                                            },
                                            { preventScrollReset: true }
                                        );
                                    }}
                                />
                                {actionData?.errors.discount && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.errors.discount[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="total">total</Label>
                                <Input
                                    id="total"
                                    type="number"
                                    name="total"
                                    placeholder="9000"
                                    value={total}
                                />
                                {actionData?.errors.total && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.errors.total[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                <Label htmlFor="customer">Customer</Label>
                                <Select name="customer">
                                    <SelectTrigger
                                        id="customer"
                                        aria-label="Select customer"
                                    >
                                        <SelectValue placeholder="Select customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loaderData.customers?.map(
                                            (customer) => {
                                                return (
                                                    <SelectItem
                                                        key={customer.id}
                                                        className="capitalize"
                                                        value={customer.id}
                                                    >
                                                        {customer.first_name}{" "}
                                                        {customer.last_name}
                                                    </SelectItem>
                                                );
                                            }
                                        )}
                                    </SelectContent>
                                </Select>
                                {actionData?.errors.customer && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.errors.customer[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Form>
        </main>
    );
}
