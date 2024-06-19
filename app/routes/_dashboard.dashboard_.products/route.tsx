import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

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
import ProductsTable from "./table";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { getSession } from "~/app/cookie.server";
import {
    Status,
    getAllProducts,
    getProductBasedOnStatus,
} from "~/app/lib/data/products";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    if (!session) {
        return;
    }

    const params = new URL(request.url).searchParams.get("status");
    if (params) {
        const products = await getProductBasedOnStatus(
            params as Status,
            session.groupId
        );
        if (!products) {
            return;
        }

        return json({ products });
    }

    const products = await getAllProducts(session.groupId);
    if (!products) {
        return;
    }

    return json({ products });
}

export default function Products() {
    const loaderData = useLoaderData<typeof loader>();
    const [searchParams, setSearchParams] = useSearchParams();
    const status = searchParams.get("status");

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
                            All
                        </TabsTrigger>
                        <TabsTrigger
                            value="in-stock"
                            onClick={() => {
                                const params = new URLSearchParams();
                                params.set("status", "in-stock");
                                setSearchParams(params, {
                                    preventScrollReset: true,
                                });
                            }}
                        >
                            In stock
                        </TabsTrigger>
                        <TabsTrigger
                            value="out-of-stock"
                            onClick={() => {
                                const params = new URLSearchParams();
                                params.set("status", "out-of-stock");
                                setSearchParams(params, {
                                    preventScrollReset: true,
                                });
                            }}
                        >
                            Out of stock
                        </TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <Link to="/dashboard/products/add">
                            <Button size="sm" className="h-8 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add Product
                                </span>
                            </Button>
                        </Link>
                    </div>
                </div>
                <TabsContent value={status || "all"}>
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Products</CardTitle>
                            <CardDescription>
                                Manage your products and view their sales
                                performance.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProductsTable products={loaderData.products} />
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>1-10</strong> of{" "}
                                <strong>32</strong> products
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
}
