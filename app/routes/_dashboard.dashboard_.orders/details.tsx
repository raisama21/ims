import { Form, Link } from "@remix-run/react";
import {
    ChevronLeft,
    ChevronRight,
    Copy,
    CreditCard,
    MoreVertical,
    Truck,
} from "lucide-react";

import { Button } from "~/app/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "~/app/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/app/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "~/app/components/ui/pagination";
import { Separator } from "~/app/components/ui/separator";
import type { OrderDetails } from "~/app/lib/data/orders";

export default function OrderDetails({ details }: { details: OrderDetails }) {
    function timestampToDateString(timestamp: string) {
        const date = new Date(timestamp);

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    return (
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                        Order {details?.id.split("-")[0]}
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Copy Order ID</span>
                        </Button>
                    </CardTitle>
                    <CardDescription>
                        Date: {timestampToDateString(details?.created_at)}
                    </CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                    <Link to={`${details?.id}/track-order`}>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1"
                        >
                            <Truck className="h-3.5 w-3.5" />
                            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                                Track Order
                            </span>
                        </Button>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                            >
                                <MoreVertical className="h-3.5 w-3.5" />
                                <span className="sr-only">More</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link to={`${details?.id}/edit`}>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                            </Link>
                            <Form
                                method="POST"
                                action={`${details?.id}/destroy`}
                            >
                                <DropdownMenuItem>
                                    <button
                                        type="submit"
                                        className="w-full text-left"
                                    >
                                        Trash
                                    </button>
                                </DropdownMenuItem>
                            </Form>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                    <div className="font-semibold">Order Details</div>
                    <ul className="grid gap-3">
                        {details?.products.map((product) => {
                            return (
                                <li
                                    className="flex items-center justify-between"
                                    key={product.name}
                                >
                                    <span className="text-muted-foreground">
                                        {product.name} x{" "}
                                        <span>{product.quantity}</span>
                                    </span>
                                    <span>₹{product.price}</span>
                                </li>
                            );
                        })}
                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                                Subtotal
                            </span>
                            <span>₹{details?.sub_total}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                                Delivery
                            </span>
                            <span>₹{details?.delivery_charge}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                                Discount
                            </span>
                            <span>{details?.discount_in_percentage}%</span>
                        </li>
                        <li className="flex items-center justify-between font-semibold">
                            <span className="text-muted-foreground">Total</span>
                            <span>₹{details?.total}</span>
                        </li>
                    </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                        <div className="font-semibold">
                            Shipping information
                        </div>
                        <address className="grid gap-0.5 not-italic text-muted-foreground">
                            <span>
                                {details?.first_name} {details?.last_name}
                            </span>
                            <span>{details?.street_address}</span>
                            <span>
                                {details?.city}, {details?.postal_code}
                            </span>
                        </address>
                    </div>
                    {/**
                    <div className="grid auto-rows-max gap-3">
                        <div className="font-semibold">Billing Information</div>
                        <div className="text-muted-foreground">
                            Same as shipping address
                        </div>
                    </div>
                    */}
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                    <div className="font-semibold">Customer Information</div>
                    <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Customer</dt>
                            <dd>
                                {details?.first_name} {details?.last_name}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Email</dt>
                            <dd>
                                <Link to="mailto:">{details?.email}</Link>
                            </dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Phone</dt>
                            <dd>
                                <Link to="tel:">{details?.phone_number}</Link>
                            </dd>
                        </div>
                    </dl>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                    <div className="font-semibold">Payment Information</div>
                    <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <dt className="flex items-center gap-1 text-muted-foreground">
                                <CreditCard className="h-4 w-4" />
                                E-wallet
                            </dt>
                            <dd className="capitalize">Saugat Dahal</dd>
                            {/*<dd>**** **** **** 4532</dd>*/}
                        </div>
                    </dl>
                </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                    Updated{" "}
                    <time dateTime="2023-11-23">
                        {timestampToDateString(details?.created_at)}
                    </time>
                </div>
                <Pagination className="ml-auto mr-0 w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                                <span className="sr-only">Previous Order</span>
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                                <span className="sr-only">Next Order</span>
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </CardFooter>
        </Card>
    );
}
