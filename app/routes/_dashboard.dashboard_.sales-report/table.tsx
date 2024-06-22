import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/app/components/ui/table";
import { SalesReport } from "~/app/lib/data/sales";
import { timestampToDateString } from "~/app/lib/utils";

export default function SalesReportTable({
    sales,
}: {
    sales: SalesReport[] | undefined;
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product name</TableHead>
                    <TableHead>Purchase price</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Selling price
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Quantity
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Total amount
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sales?.map((sale) => {
                    return (
                        <TableRow key={sale.product_name + sale.created_at}>
                            <TableCell>{sale.product_name}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                {sale?.purchase_price}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {sale?.selling_price}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {sale?.quantity}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {sale?.total}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
