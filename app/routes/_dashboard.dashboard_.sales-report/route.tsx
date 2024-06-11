import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/app/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "~/app/components/ui/tabs";

import SalesReportTable from "./table";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getSalesReport } from "./data";

export async function loader({ request }: LoaderFunctionArgs) {
    const filberBy = new URL(request.url).searchParams.get("filter-by");

    const sales = await getSalesReport();
    if (!sales) return;

    return json({ sales });
}

export default function SalesReport() {
    const [params, setSearchParams] = useSearchParams();
    const loaderData = useLoaderData<typeof loader>();

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="week">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger
                            value="week"
                            onClick={() => {
                                let params = new URLSearchParams();
                                params.set("filter-by", "week");
                                setSearchParams(params, {
                                    preventScrollReset: true,
                                });
                            }}
                        >
                            Week
                        </TabsTrigger>
                        <TabsTrigger
                            value="month"
                            onClick={() => {
                                let params = new URLSearchParams();
                                params.set("filter-by", "month");
                                setSearchParams(params, {
                                    preventScrollReset: true,
                                });
                            }}
                        >
                            Month
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="week">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Sales</CardTitle>
                            <CardDescription></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SalesReportTable sales={loaderData.sales} />
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
