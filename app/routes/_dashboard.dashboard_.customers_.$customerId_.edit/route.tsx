import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { z } from "zod";

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
import { getSession } from "~/app/cookie.server";
import updateCustomer, {
    UpdateCustomersFormSchema,
    validate,
} from "~/app/lib/actions/customers/update";
import { getOneCustomerData } from "~/app/lib/data/customers";

export async function loader({ request, params }: LoaderFunctionArgs) {
    invariant(params.customerId, "param customerId not found");

    const session = await getSession(request);
    if (!session) {
        return;
    }

    const user = await getOneCustomerData(params.customerId, session.groupId);
    if (!user) {
        return;
    }

    return json({ user });
}

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.customerId, "param customerId not found");

    const session = await getSession(request);
    if (!session) {
        return;
    }

    const formData = await request.formData();
    const customersData = Object.fromEntries(formData) as unknown as z.infer<
        typeof UpdateCustomersFormSchema
    >;

    const { safeParse, errors } = await validate(customersData);
    if (errors) {
        return json({ errors });
    }

    await updateCustomer(safeParse.data, session.groupId, params.customerId);

    return redirect("/dashboard/customers");
}

export default function EditCustomer() {
    const actionData = useActionData<typeof action>();
    const loaderData = useLoaderData<typeof loader>();

    return (
        <main className="px-8">
            <Form method="POST" className="mx-auto grid max-w-[59rem] gap-4">
                <div className="flex justify-end gap-2">
                    <Link to="/dashboard/customers">
                        <Button variant="outline" size="sm">
                            Discard
                        </Button>
                    </Link>
                    <Button size="sm" type="submit">
                        Edit Customers
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Add customers</CardTitle>
                        <CardDescription>
                            Add your customer information here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    className="w-full"
                                    placeholder="John"
                                    defaultValue={loaderData.user.first_name}
                                />
                                {actionData?.errors.firstName && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.errors.firstName[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    className="w-full"
                                    defaultValue={loaderData.user.last_name}
                                />
                                {actionData?.errors.lastName && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.errors.lastName[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="w-full"
                                    placeholder="john.doe@example.com"
                                    defaultValue={loaderData.user.email}
                                />
                                {actionData?.errors.email && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.errors.email[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="phoneNumber">
                                    Phone Number
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    type="number"
                                    name="phoneNumber"
                                    defaultValue={loaderData.user.phone_number}
                                />
                                {actionData?.errors.phoneNumber && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.errors.phoneNumber[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>customers address</CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="streetAddress">
                                    Street Address
                                </Label>
                                <Input
                                    id="streetAddress"
                                    name="streetAddress"
                                    type="text"
                                    className="w-full"
                                    placeholder="Pashupati Rd"
                                    defaultValue={
                                        loaderData.user?.street_address
                                    }
                                />
                                {actionData?.errors.streetAddress && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.errors
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
                                    name="city"
                                    type="text"
                                    className="w-full"
                                    placeholder="Kathmandu"
                                    defaultValue={loaderData.user?.city}
                                />
                                {actionData?.errors.city && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.errors.city[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="provience">provience</Label>
                                <Input
                                    id="provience"
                                    type="text"
                                    name="provience"
                                    className="w-full"
                                    placeholder="Bagmati Pradesh"
                                    defaultValue={loaderData.user?.provience}
                                />
                                {actionData?.errors.provience && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.errors.provience[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    type="number"
                                    name="postalCode"
                                    placeholder="46000"
                                    defaultValue={loaderData.user?.postal_code}
                                />
                                {actionData?.errors.postalCode && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.errors.postalCode[0]}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Form>
        </main>
    );
}
