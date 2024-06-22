import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";

import { PlusCircle } from "lucide-react";
import { Button } from "~/app/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/app/components/ui/card";
import CustomersTable from "./table";
import { getSession } from "~/app/cookie.server";
import { getAllCustomers } from "~/app/lib/data/customers";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    if (!session) {
        return;
    }

    const customers = await getAllCustomers(session.groupId);
    if (!customers) {
        return;
    }

    return json({ customers });
}

export default function Customers() {
    const loaderData = useLoaderData<typeof loader>();

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-4">
            <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <Link to="/dashboard/customers/add">
                        <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Add Customers
                            </span>
                        </Button>
                    </Link>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Customers</CardTitle>
                    <CardDescription>
                        Manage your customers here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CustomersTable customers={loaderData.customers} />
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                        customers
                    </div>
                </CardFooter>
            </Card>
        </main>
    );
}
