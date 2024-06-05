import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import z from "zod";

import { Button } from "~/app/components/ui/button";
import { Input } from "~/app/components/ui/input";
import { Label } from "~/app/components/ui/label";
import { authCookie } from "~/app/cookie.server";

import authentication, { LoginFormSchema, validate } from "~/app/lib/actions/auth/login";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const loginData = Object.fromEntries(formData) as z.infer<
        typeof LoginFormSchema
    >;

    const errors = await validate(loginData);
    if (errors) {
        return json({ state: errors });
    }

    const user = await authentication(loginData);

    return redirect("/dashboard", {
        headers: {
            "Set-Cookie": await authCookie.serialize(user)
        }
    });
}

export default function Login() {
    const actionData = useActionData<typeof action>();

    return (
        <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Log in</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                <Form method="POST" className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                            id="businessName"
                            type="businessName"
                            name="businessName"
                            placeholder="ABC business"
                        />
                        {actionData?.state?.errors.businessName && (
                            <div>
                                <p className="pl-2 text-xs font-medium text-red-500">
                                    {actionData?.state?.errors.businessName[0]}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="m@example.com"
                        />
                        {actionData?.state?.errors.email && (
                            <div>
                                <p className="pl-2 text-xs font-medium text-red-500">
                                    {actionData?.state?.errors.email[0]}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input id="password" type="password" name="password" />

                        {actionData?.state?.errors.password && (
                            <div>
                                <p className="pl-2 text-xs font-medium text-red-500">
                                    {actionData?.state?.errors.password[0]}
                                </p>
                            </div>
                        )}
                    </div>
                    <Button type="submit" className="w-full">
                        Log in
                    </Button>
                    <Button variant="outline" className="w-full">
                        Login with Google
                    </Button>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
