import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { Link, useLoaderData } from "@remix-run/react";
import { ListFilter, PlusCircle } from "lucide-react";

import { Button } from "~/app/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/app/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/app/components/ui/dropdown-menu";

import UserManagementTable from "./table";
import { getSession } from "~/app/cookie.server";
import { getAllUser } from "~/app/lib/data/users";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    if (session.roles !== "admin") {
        return redirect("/dashboard");
    }

    const users = await getAllUser(session.groupId);
    if (!users) {
        return;
    }

    return { users };
}

export default function UserManagement() {
    const loaderData = useLoaderData<typeof loader>();

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1"
                            >
                                <ListFilter className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Filter
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked>
                                Admin
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                                Product Manager
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                                Sales Person
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Link to="/dashboard/user-management/create">
                        <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only capitalize sm:not-sr-only sm:whitespace-nowrap">
                                Create User
                            </span>
                        </Button>
                    </Link>
                </div>
            </div>
            <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                    <CardTitle>User Groups</CardTitle>
                    <CardDescription>
                        Manage your user keep track of their work.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UserManagementTable users={loaderData.users} />
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>10</strong> users
                    </div>
                </CardFooter>
            </Card>
        </main>
    );
}
