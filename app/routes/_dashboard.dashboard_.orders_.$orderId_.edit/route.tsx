import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Link, Form, useActionData } from "@remix-run/react";
import z from "zod";

import { ChevronLeft, Upload } from "lucide-react";

import { Button } from "~/app/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "~/app/components/ui/card";
import { Label } from "~/app/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/app/components/ui/select";
import { getSession } from "~/app/cookie.server";
import { Input } from "~/app/components/ui/input";
import updateOrder, {
    EditOrdersFormSchema,
    validate,
} from "~/app/lib/actions/orders/update";
import invariant from "tiny-invariant";

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.orderId, "param orderId not found");
    const session = await getSession(request);
    if (session.roles === "sales-person") {
        return;
    }

    const formData = await request.formData();
    const paymentData = Object.fromEntries(formData) as unknown as z.infer<
        typeof EditOrdersFormSchema
    >;

    const { safeParse, errors } = await validate(paymentData);
    if (errors) {
        return json({ errors });
    }

    await updateOrder(safeParse.data, params.orderId);

    return redirect("/dashboard/orders");
}

export default function Edit() {
    const actionData = useActionData<typeof action>();
    const paymentMethods = ["e-wallet", "mobile-banking", "in-person"];

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Form
                method="POST"
                className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
            >
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
                            Edit order
                        </Button>
                    </div>
                </div>
                <div className="">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="paymentId">
                                        Payment ID
                                    </Label>
                                    <Input
                                        type="text"
                                        id="paymentId"
                                        name="paymentId"
                                        placeholder="example: 9825345432"
                                    />

                                    {actionData?.errors.status && (
                                        <div>
                                            <p className="pl-2 text-xs font-medium text-red-500">
                                                {actionData?.errors.status[0]}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="customer">
                                        Payment method
                                    </Label>
                                    <Select name="paymentMethod">
                                        <SelectTrigger
                                            id="paymentMethod"
                                            aria-label="select payment method"
                                        >
                                            <SelectValue placeholder="Select payment method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paymentMethods.map((item) => {
                                                return (
                                                    <SelectItem
                                                        value={item}
                                                        key={item}
                                                    >
                                                        {item}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    {actionData?.errors.status && (
                                        <div>
                                            <p className="pl-2 text-xs font-medium text-red-500">
                                                {actionData?.errors.status[0]}
                                            </p>
                                        </div>
                                    )}
                                </div>
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
                                            <SelectItem value="paid">
                                                Paid
                                            </SelectItem>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {actionData?.errors.status && (
                                        <div>
                                            <p className="pl-2 text-xs font-medium text-red-500">
                                                {actionData?.errors.status[0]}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
