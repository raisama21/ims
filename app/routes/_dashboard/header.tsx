import { Form, Link } from "@remix-run/react";
import { Package2, PanelLeft, Search, SettingsIcon } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "~/app/components/ui/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/app/components/ui/breadcrumb";
import { Button } from "~/app/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/app/components/ui/dropdown-menu";
import { Input } from "~/app/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "~/app/components/ui/sheet";
import { links } from "./links";

export default function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            to="#"
                            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                        >
                            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        {links.map((link) => {
                            const NavIcon = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <NavIcon className="h-5 w-5" />
                                    {link.name}
                                </Link>
                            );
                        })}
                        <Link
                            to="/dashboard/settings"
                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <SettingsIcon className="h-5 w-5" />
                            Settings
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="#">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="#">Orders</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Recent Orders</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="overflow-hidden rounded-full"
                    >
                        <Avatar>
                            <AvatarImage src="#" alt="Avatar" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Form method="POST" action="/logout">
                        <button className="w-full">
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </button>
                    </Form>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
