import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";

import { ListFilter, PlusCircle } from "lucide-react";
import { Button } from "~/app/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/app/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/app/components/ui/dropdown-menu";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "~/app/components/ui/tabs";
import CustomersTable from "./table";
import { getSession } from "~/app/cookie.server";
import {
    Status,
    getCustomerBasedOnPaymentStatus,
    getDataForCustomerTable,
} from "~/app/lib/data/customers";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    if (!session) {
        return;
    }

    const params = new URL(request.url).searchParams.get("status");
    if (params) {
        const customers = await getCustomerBasedOnPaymentStatus(
            params as Status,
            session.groupId
        );
        if (!customers) {
            return;
        }

        return json({ customers });
    }

    const customers = await getDataForCustomerTable(session.groupId);
    if (!customers) {
        return;
    }

    return json({ customers });
}

export default function Customers() {
    const loaderData = useLoaderData<typeof loader>();
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger
                            value="all"
                            onClick={() => {
                                const params = new URLSearchParams();
                                params.delete("status");
                                setSearchParams(params, {
                                    preventScrollReset: true,
                                });
                            }}
                        >
                            all
                        </TabsTrigger>
                        <TabsTrigger
                            value="paid"
                            onClick={() => {
                                const params = new URLSearchParams();
                                params.set("status", "paid");
                                setSearchParams(params, {
                                    preventScrollReset: true,
                                });
                            }}
                        >
                            Paid
                        </TabsTrigger>
                        <TabsTrigger
                            value="pending"
                            onClick={() => {
                                const params = new URLSearchParams();
                                params.set("status", "pending");
                                setSearchParams(params, {
                                    preventScrollReset: true,
                                });
                            }}
                        >
                            Pending
                        </TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1"
                                >
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Filter
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>
                                    All
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Paid
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Pending
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                <TabsContent value={searchParams.get("status") || "all"}>
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
                                Showing <strong>1-10</strong> of{" "}
                                <strong>32</strong> customers
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
}
