import { Form, Link } from "@remix-run/react";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "~/app/components/ui/badge";
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
import { Products } from "~/app/lib/defitions";
import { timestampToDateString } from "~/app/lib/utils";

export default function ProductsTable({ products }: { products: Products[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">img</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Price
                    </TableHead>
                    {/*
                    <TableHead className="hidden md:table-cell">
                        Total Sales
                    </TableHead>
                    */}
                    <TableHead className="hidden md:table-cell">
                        Created at
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => {
                    return (
                        <TableRow>
                            <TableCell className="hidden sm:table-cell">
                                <img
                                    alt="Product image"
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="/placeholder.svg"
                                    width="64"
                                />
                            </TableCell>
                            <TableCell className="font-medium">
                                {product.product_name}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">
                                    {product.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                ₹{product.selling_price}
                            </TableCell>
                            {/*
                            <TableCell className="hidden md:table-cell">
                                {30}
                            </TableCell>
                            */}
                            <TableCell className="hidden md:table-cell">
                                {timestampToDateString(product.created_at)}
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
                                        <Link to={`${product.id}/edit`}>
                                            <DropdownMenuItem>
                                                Edit
                                            </DropdownMenuItem>
                                        </Link>
                                        <Form
                                            method="POST"
                                            action={`${product.id}/destroy`}
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
