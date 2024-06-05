import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

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
import updateCustomers, { validate } from "~/app/lib/actions/customers/update";
import { getOneCustomer } from "~/app/lib/data/customers";

export async function loader({ request, params }: LoaderFunctionArgs) {
    invariant(params.customerId, "param customerId not found");

    const session = await getSession(request);
    if (!session) {
        return;
    }

    const customer = await getOneCustomer(params.customerId, session.groupId);
    if (!customer) {
        return;
    }

    return json({ customer });
}

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.customerId, "param customerId not found");

    const session = await getSession(request);
    if (session?.roles === "sales-person") {
        return;
    }

    const formData = await request.formData();
    const customersData = {
        firstName: String(formData.get("firstName")),
        lastName: String(formData.get("lastName")),
        email: String(formData.get("email")),
        phoneNumber: Number(formData.get("phoneNumber")),
    };

    const errors = await validate(customersData);
    if (errors) {
        return json({ state: errors });
    }

    await updateCustomers(customersData, params.customerId, session.groupId);

    return redirect("/dashboard/customers");
}

export default function EditCustomers() {
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
                        <CardTitle>Edit Customers</CardTitle>
                        <CardDescription>
                            Edit your customer information here.
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
                                    defaultValue={
                                        loaderData.customer.first_name
                                    }
                                />
                                {actionData?.state?.errors.firstName && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.state?.errors
                                                    .firstName[0]
                                            }
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
                                    placeholder="Doe"
                                    defaultValue={loaderData.customer.last_name}
                                />
                                {actionData?.state?.errors.lastName && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.state?.errors
                                                    .lastName[0]
                                            }
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
                                    defaultValue={loaderData.customer.email}
                                />
                                {actionData?.state?.errors.email && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.state?.errors.email[0]}
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
                                    defaultValue={
                                        loaderData.customer.phone_number
                                    }
                                />
                                {actionData?.state?.errors.phoneNumber && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.state?.errors
                                                    .phoneNumber[0]
                                            }
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
