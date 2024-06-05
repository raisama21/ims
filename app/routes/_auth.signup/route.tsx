import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import z from "zod";

import { Button } from "~/app/components/ui/button";
import { Input } from "~/app/components/ui/input";
import { Label } from "~/app/components/ui/label";

import signup, {
    SignupFormSchema,
    validate,
} from "~/app/lib/actions/auth/signup";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const signupData = Object.fromEntries(formData) as z.infer<
        typeof SignupFormSchema
    >;

    const errors = await validate(signupData);
    if (errors) {
        return json({ state: errors });
    }

    await signup(signupData);

    return redirect("/login");
}

export default function Signup() {
    const actionData = useActionData<typeof action>();

    return (
        <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Sign up</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your email below to signup to your account
                    </p>
                </div>
                <Form method="POST" className="grid gap-4">
                    <div className="flex items-center gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="firstName"
                                name="firstName"
                                placeholder="John"
                            />
                            {actionData?.state?.errors.firstName && (
                                <div>
                                    <p className="pl-2 text-xs font-medium text-red-500">
                                        {actionData?.state?.errors.firstName[0]}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="lastName"
                                name="lastName"
                                placeholder="Doe"
                            />
                            {actionData?.state?.errors.lastName && (
                                <div>
                                    <p className="pl-2 text-xs font-medium text-red-500">
                                        {actionData?.state?.errors.lastName[0]}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
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
                        Sign up
                    </Button>
                    <Button variant="outline" className="w-full">
                        Signup with Google
                    </Button>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
