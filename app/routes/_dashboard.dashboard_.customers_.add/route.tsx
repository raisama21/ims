import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

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
import createCustomers, { validate } from "~/app/lib/actions/customers/create";

export async function action({ request }: ActionFunctionArgs) {
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

    const errors = await validate(customersData, session.groupId);
    if (errors) {
        return json({ state: errors });
    }

    await createCustomers(customersData, session.groupId);

    return redirect("/dashboard/customers");
}

export default function CreateCustomers() {
    const actionData = useActionData<typeof action>();

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
                        Add Customers
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Add Customers</CardTitle>
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
