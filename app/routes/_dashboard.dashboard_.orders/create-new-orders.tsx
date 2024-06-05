import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "~/app/components/ui/card";
import { Button } from "~/app/components/ui/button";
import { Link } from "@remix-run/react";

export default function CreateNewOrders() {
    return (
        <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
                <CardTitle>Your Orders</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Introducing Our Dynamic Orders Dashboard for Seamless
                    Management and Insightful Analysis.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Link to="create">
                    <Button>Create New Order</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
