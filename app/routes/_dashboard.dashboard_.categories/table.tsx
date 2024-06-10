import { Form } from "@remix-run/react";

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
import { Categories } from "~/app/lib/defitions";
import { timestampToDateString } from "~/app/lib/utils";

export default function CategoriesTable({
    categories,
}: {
    categories: Categories[];
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Created at
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((category) => {
                    return (
                        <TableRow key={category.id}>
                            <TableCell className="font-medium capitalize">
                                {category.category_name}
                            </TableCell>

                            <TableCell className="hidden md:table-cell">
                                {timestampToDateString(category.created_at)}
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
                                        <Form
                                            method="POST"
                                            action={`${category.id}/destroy`}
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
