import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { NotebookPen, Package, Truck, Home, Dot } from "lucide-react";
import { Button } from "~/app/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/app/components/ui/card";
import { Progress } from "~/app/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/app/components/ui/dialog";
import { getSession } from "~/app/cookie.server";
import { getTrackingOrderDetails } from "~/app/lib/data/orders";
import updateOrderTracking from "~/app/lib/actions/orders/update-tracking";

export async function loader({ request, params }: LoaderFunctionArgs) {
    invariant(params.orderId, "param orderId not found");
    const session = await getSession(request);
    if (!session) {
        return;
    }

    const details = await getTrackingOrderDetails(
        params.orderId,
        session.groupId
    );
    if (!details) {
        return;
    }

    return json({ details });
}

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.orderId, "param orderId not found");
    const session = await getSession(request);
    if (!session) {
        return;
    }

    const status = new URL(request.url).searchParams.get("status");

    switch (status) {
        case "processing":
            await updateOrderTracking(
                params.orderId,
                session.groupId,
                "processing",
                "processed_at"
            );
            break;
        case "shipped":
            await updateOrderTracking(
                params.orderId,
                session.groupId,
                "shipped",
                "shipped_at"
            );
            break;
        case "delivered":
            await updateOrderTracking(
                params.orderId,
                session.groupId,
                "delivered",
                "delivered_at"
            );
            break;
    }

    return null;
}

export default function TrackOrder() {
    const loaderData = useLoaderData<typeof loader>();
    const [searchParams, setSearchParams] = useSearchParams();

    let progressValue = 50;

    return (
        <main className="mx-auto grid w-[59rem] gap-6 px-6 py-8">
            <Progress
                value={progressValue}
                aria-label={`${progressValue}% increase`}
            />

            <Card>
                <CardHeader>
                    <CardTitle>
                        ORDER{" "}
                        <span className="text-primary">
                            #{loaderData.details.order_id.split("-")[0]}
                        </span>
                    </CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>

                <CardContent className="flex w-full items-start justify-between">
                    <div className="text-primary">
                        <span>
                            Order Created <Dot className="inline" />
                        </span>
                        <NotebookPen />
                    </div>

                    <Dialog>
                        <DialogTrigger
                            onClick={() => {
                                let params = new URLSearchParams();
                                params.set("status", "processing");

                                setSearchParams(params, {
                                    preventScrollReset: true,
                                });
                            }}
                        >
                            <div className="text-muted-foreground">
                                <span>
                                    Order Processed <Dot className="inline" />
                                </span>
                                <Package />
                            </div>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Update order tracking
                                    </DialogTitle>
                                    <DialogDescription></DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Form method="POST">
                                        <Button
                                            type="submit"
                                            disabled={
                                                loaderData.details.processed_at
                                                    ? true
                                                    : false
                                            }
                                        >
                                            Process order
                                        </Button>
                                    </Form>
                                </DialogFooter>
                            </DialogContent>
                        </DialogTrigger>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger
                            onClick={() => {
                                let params = new URLSearchParams();
                                params.set("status", "shipped");

                                setSearchParams(params, {
                                    preventScrollReset: true,
                                });
                            }}
                        >
                            <div className="text-muted-foreground">
                                <span>
                                    Order shipped <Dot className="inline" />
                                </span>
                                <Truck />
                            </div>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Update order tracking
                                    </DialogTitle>
                                    <DialogDescription></DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Form method="POST">
                                        <Button
                                            type="submit"
                                            disabled={
                                                loaderData.details.shipped_at
                                                    ? true
                                                    : false
                                            }
                                        >
                                            Ship order
                                        </Button>
                                    </Form>
                                </DialogFooter>
                            </DialogContent>
                        </DialogTrigger>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger
                            onClick={() => {
                                let params = new URLSearchParams();
                                params.set("status", "delivered");

                                setSearchParams(params, {
                                    preventScrollReset: true,
                                });
                            }}
                        >
                            <div className="text-muted-foreground">
                                <span>
                                    Order Delivered <Dot className="inline" />
                                </span>
                                <Home />
                            </div>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Update order tracking
                                    </DialogTitle>
                                    <DialogDescription></DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Form method="POST">
                                        <Button
                                            type="submit"
                                            disabled={
                                                loaderData.details.delivered_at
                                                    ? true
                                                    : false
                                            }
                                        >
                                            Deliver order
                                        </Button>
                                    </Form>
                                </DialogFooter>
                            </DialogContent>
                        </DialogTrigger>
                    </Dialog>
                </CardContent>
            </Card>
        </main>
    );
}
