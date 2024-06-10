import { Form, Link } from "@remix-run/react";
import clsx from "clsx";

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
import { Users } from "~/app/lib/defitions";

export default function UserManagementTable({ users }: { users: Users[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Email
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Roles
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
                {users.map((user) => {
                    return (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                {user.first_name}
                            </TableCell>
                            <TableCell>{user.last_name}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                {user.email}
                            </TableCell>
                            <TableCell className="hidden uppercase md:table-cell">
                                <Badge variant="outline" className="capitalize">
                                    {user.roles}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                2024-02-14 02:14 PM
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
                                        <Link to={`${user.id}/edit`}>
                                            <DropdownMenuItem>
                                                Edit
                                            </DropdownMenuItem>
                                        </Link>
                                        <Form
                                            method="POST"
                                            action={`${user.id}/destroy`}
                                        >
                                            <DropdownMenuItem>
                                                <button
                                                    className={clsx(
                                                        "w-full text-left",
                                                        user.roles ===
                                                            "admin" &&
                                                            "cursor-not-allowed"
                                                    )}
                                                    disabled={
                                                        user.roles === "admin"
                                                            ? true
                                                            : false
                                                    }
                                                >
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
