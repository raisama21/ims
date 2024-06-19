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

import updateUser, {
    UpdateUserFormSchema,
    validate,
} from "~/app/lib/actions/users/update";
import { getOneUser } from "~/app/lib/data/users";

export async function loader({ request, params }: LoaderFunctionArgs) {
    invariant(params.userId, "param userId not found");
    const session = await getSession(request);
    if (session?.roles !== "admin") {
        return;
    }

    const user = await getOneUser(params.userId, session.groupId);
    if (!user) {
        return;
    }

    return json({ user });
}

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.userId, "param userId not found");
    const session = await getSession(request);
    if (session?.roles !== "admin") {
        return;
    }

    const formData = await request.formData();
    const userData = Object.fromEntries(formData) as z.infer<
        typeof UpdateUserFormSchema
    >;

    const { safeParse, errors } = await validate(userData);
    if (errors) {
        return json({ errors });
    }

    await updateUser(safeParse.data, session.groupId, params.userId);

    return redirect("/dashboard/user-management");
}

export default function EditUser() {
    const actionData = useActionData<typeof action>();
    const loaderData = useLoaderData<typeof loader>();

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
                        Edit User
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
                                    placeholder="Doe"
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
                                {actionData?.errors.roles && (
                                    <div>
                                        <p className="pl-2 text-xs font-medium text-red-500">
                                            {actionData?.errors.roles[0]}
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
