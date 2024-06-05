import { File, ListFilter } from "lucide-react";
import { Button } from "~/app/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
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

import OrdersTable from "./table";
import CreateNewOrders from "./create-new-orders";
import RevenueTracker from "./revenue-tracker";
import OrderDetails from "./details";

export default function Dashboard() {
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    <CreateNewOrders />

                    <RevenueTracker />
                </div>
                <Tabs defaultValue="week">
                    <div className="flex items-center">
                        <TabsList>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                            <TabsTrigger value="year">Year</TabsTrigger>
                        </TabsList>
                        <div className="ml-auto flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 gap-1 text-sm"
                                    >
                                        <ListFilter className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only">
                                            Filter
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        Filter by
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem checked>
                                        Fulfilled
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>
                                        Declined
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>
                                        Refunded
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 gap-1 text-sm"
                            >
                                <File className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only">
                                    Export
                                </span>
                            </Button>
                        </div>
                    </div>
                    <TabsContent value="week">
                        <Card x-chunk="dashboard-05-chunk-3">
                            <CardHeader className="px-7">
                                <CardTitle>Orders</CardTitle>
                                <CardDescription>
                                    Recent orders from your store.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <OrdersTable />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <div>
                <OrderDetails />
            </div>
        </main>
    );
}
