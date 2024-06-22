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
import { Customers } from "~/app/lib/defitions";
import { timestampToDateString } from "~/app/lib/utils";

export default function CustomerTable({
    customers,
}: {
    customers: Customers[];
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Phone Number
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Created at
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {customers.map((customer) => {
                    return (
                        <TableRow key={customer.id}>
                            <TableCell>
                                <div className="font-medium">
                                    {customer.first_name} {customer.last_name}
                                </div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    {customer.email}
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {customer.phone_number}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {timestampToDateString(customer.created_at)}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">
                                                Toggle menu
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            Actions
                                        </DropdownMenuLabel>
                                        <Link to={`${customer.id}/edit`}>
                                            <DropdownMenuItem>
                                                Edit
                                            </DropdownMenuItem>
                                        </Link>
                                        <Form
                                            method="POST"
                                            action={`${customer.id}/destroy`}
                                        >
                                            <DropdownMenuItem>
                                                <button className="w-full text-left">
                                                    Delete
                                                </button>
                                            </DropdownMenuItem>
                                        </Form>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
