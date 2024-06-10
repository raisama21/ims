import { useSearchParams } from "@remix-run/react";
import { Badge } from "~/app/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/app/components/ui/table";
import { OrderTableData } from "~/app/lib/data/orders";
import { timestampToDateString } from "~/app/lib/utils";

export default function OrdersTable({ data }: { data: OrderTableData[] }) {
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">
                        Payment method
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                        Payment status
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((order) => {
                    return (
                        <TableRow
                            className="bg-accent"
                            key={order.id}
                            onClick={() => {
                                const params = new URLSearchParams();
                                params.set("oid", order.id);
                                setSearchParams(params, {
                                    preventScrollReset: true,
                                });
                            }}
                        >
                            <TableCell>
                                <div className="font-medium">
                                    {order.first_name} {order.last_name}
                                </div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    {order.email}
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {"none"}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <Badge className="text-xs" variant="secondary">
                                    {"pending"}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {timestampToDateString(order.created_at)}
                            </TableCell>
                            <TableCell className="text-right">
                                ₹{order.total}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
