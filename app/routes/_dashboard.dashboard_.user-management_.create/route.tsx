import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/app/components/ui/select";
import { getSession } from "~/app/cookie.server";

import createUser, {
    CreateUserFormSchema,
    validate,
} from "~/app/lib/actions/users/create";

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request);
    if (session?.roles !== "admin") {
        return;
    }

    const formData = await request.formData();
    const userData = Object.fromEntries(formData) as z.infer<
        typeof CreateUserFormSchema
    >;

    const errors = await validate(userData);
    if (errors) {
        return json({ state: errors });
    }

    await createUser(userData, session.groupId);

    return redirect("/dashboard/user-management");
}

export default function CreateUser() {
    const actionData = useActionData<typeof action>();

    return (
        <main className="px-8">
            <Form method="POST" className="mx-auto grid max-w-[59rem] gap-4">
                <div className="flex justify-end gap-2">
                    <Link to="/dashboard/user-management">
                        <Button variant="outline" size="sm">
                            Discard
                        </Button>
                    </Link>
                    <Button size="sm" type="submit">
                        Create User
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Create User Groups</CardTitle>
                        <CardDescription>
                            Create your new user groups here.
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
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                />
                                {actionData?.state?.errors.password && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {
                                                actionData?.state?.errors
                                                    .password[0]
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">Roles</Label>
                                <Select name="roles">
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Roles</SelectLabel>
                                            <SelectItem value="product-manager">
                                                Product-Manager
                                            </SelectItem>
                                            <SelectItem value="sales-person">
                                                Sales-Person
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {actionData?.state?.errors.roles && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.state?.errors.roles[0]}
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
