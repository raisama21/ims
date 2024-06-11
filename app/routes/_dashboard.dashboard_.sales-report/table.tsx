import { Form, Link } from "@remix-run/react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/app/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "~/app/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/app/components/ui/table";
import { timestampToDateString } from "~/app/lib/utils";
import { SalesReport } from "./data";

export default function SalesReportTable({ sales }: { sales: SalesReport[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead className=" md:table-cell">
                        Total unit sold
                    </TableHead>
                    <TableHead className=" md:table-cell">
                        Product Name
                    </TableHead>
                    <TableHead>Product sales</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sales.map((sale) => {
                    return (
                        <TableRow>
                            <TableCell className="font-medium">
                                {sale.total_orders}
                            </TableCell>
                            <TableCell className=" md:table-cell">
                                {sale.total_sales}
                            </TableCell>
                            <TableCell className=" md:table-cell">
                                {sale.total_units_sold}
                            </TableCell>
                            <TableCell className=" md:table-cell">
                                {sale.product_name}
                            </TableCell>
                            <TableCell className=" md:table-cell">
                                {sale.product_sales}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
