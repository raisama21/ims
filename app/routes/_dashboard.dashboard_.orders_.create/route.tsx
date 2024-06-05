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
        subTotal: formData.get("subTotal"),
        deliveryCharge: formData.get("deliveryCharge"),
        discount: formData.get("discount"),
        total: formData.get("total"),
        customer: formData.get("customer"),
        paymentMethod: formData.get("paymentMethod"),
        paymentId: formData.get("paymentId"),
        streetAddress: formData.get("streetAddress"),
        city: formData.get("city"),
        provience: formData.get("provience"),
        postalCode: formData.get("postalCode"),
    } as unknown as z.infer<typeof CreateOrdersFormSchema>;
    console.log(orderData);

    const errors = await validate(orderData);
    if (errors) {
        return json({ state: errors });
    }

    await createOrder(orderData, session.groupId);

    return redirect("/dashboard/orders");
}

export default function Create() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();

    const [searchParam, setSearchParam] = useSearchParams();

    const [products, setProduct] = useState<string[]>([]);
    const selectedProducts = loaderData.products?.filter((product) => {
        return products.includes(product.product_name);
    });

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
                            {products.map((product) => {
                                return (
                                    <div
                                        className="grid grid-cols-[repeat(2,1fr)] gap-3"
                                        key={product}
                                    >
                                        <div>
                                            <Label htmlFor="product">
                                                Product name
                                            </Label>
                                            <Input
                                                id="product"
                                                type="text"
                                                name="product"
                                                defaultValue={product}
                                            />
                                            {actionData?.state.errors
                                                .product && (
                                                <div>
                                                    <p className="pl-2 text-xs font-medium text-red-500">
                                                        {
                                                            actionData?.state
                                                                .errors
                                                                .product[0]
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
                                            />
                                            {actionData?.state.errors
                                                .quantity && (
                                                <div>
                                                    <p className="pl-2 text-xs font-medium text-red-500">
                                                        {
                                                            actionData?.state
                                                                .errors
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
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => {
                                        const params = new URLSearchParams();
                                        params.set("sub-total", e.target.value);
                                        setSearchParam(params, {
                                            preventScrollReset: true,
                                        });
                                    }}
                                />
                                {actionData?.state.errors.subTotal && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.state.errors
                                                    .subTotal[0]
                                            }
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
                                />
                                {actionData?.state.errors.deliveryCharge && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.state.errors
                                                    .deliveryCharge[0]
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="discountInPercentage">
                                    Discount
                                </Label>
                                <Input
                                    id="discountInPercentage"
                                    type="number"
                                    name="discountInPercentage"
                                    placeholder="10%"
                                />
                                {actionData?.state.errors.discount && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.state.errors
                                                    .discount[0]
                                            }
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
                                />
                                {actionData?.state.errors.total && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.state.errors.total[0]}
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
                                {actionData?.state.errors.customer && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.state.errors
                                                    .customer[0]
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <div className="grid gap-3">
                                <Label htmlFor="paymentMethod">Method</Label>
                                <Select name="paymentMethod">
                                    <SelectTrigger
                                        id="paymentMethod"
                                        aria-label="payment method"
                                    >
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            className="capitalize"
                                            value="e-wallet"
                                        >
                                            E-wallet
                                        </SelectItem>
                                        <SelectItem
                                            className="capitalize"
                                            value="mobile-banking"
                                        >
                                            Mobile Banking
                                        </SelectItem>
                                        <SelectItem
                                            className="capitalize"
                                            value="in-person"
                                        >
                                            In Person
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {actionData?.state.errors.paymentMethod && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.state.errors
                                                    .paymentMethod[0]
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="phoneNumber">
                                    Mo-bank / e-wallet
                                </Label>
                                <Input
                                    id="paymentId"
                                    type="text"
                                    placeholder="ID: 9825******"
                                    name="paymentId"
                                />
                                {actionData?.state.errors.paymentId && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.state.errors
                                                    .paymentId[0]
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="streetAddress">
                                    Street Address
                                </Label>
                                <Input
                                    id="streetAddress"
                                    type="text"
                                    placeholder="Dhumbarahi pipalbot"
                                    name="streetAddress"
                                />
                                {actionData?.state.errors.streetAddress && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.state.errors
                                                    .streetAddress[0]
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    type="text"
                                    placeholder="Kathmandu"
                                    name="city"
                                />
                                {actionData?.state.errors.city && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.state.errors.city[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="provience">Provience</Label>
                                <Input
                                    id="provience"
                                    type="text"
                                    placeholder="Bagmati"
                                    name="provience"
                                />
                                {actionData?.state.errors.provience && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.state.errors
                                                    .provience[0]
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="postalCode">Postal code</Label>
                                <Input
                                    id="postalCode"
                                    type="number"
                                    placeholder="Bagmati"
                                    name="postalCode"
                                />
                                {actionData?.state.errors.postalCode && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.state.errors
                                                    .postalCode[0]
                                            }
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
