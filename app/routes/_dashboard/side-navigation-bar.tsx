import { Link } from "@remix-run/react";
import { Package2, Settings } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "~/app/components/ui/tooltip";
import { links } from "./links";
import { Session } from "~/app/cookie.server";

export default function SideNavigationBar({ session }: { session: Session }) {
    const filteredLinks = links.filter((link) => {
        if (session.roles === "admin") {
            return link;
        }

        return link.href !== "/dashboard/user-management";
    });

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link
                    to="#"
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                    <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                {filteredLinks.map((link) => {
                    const NavIcon = link.icon;

                    return (
                        <TooltipProvider key={link.href}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        to={link.href}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                    >
                                        <NavIcon className="h-5 w-5" />
                                        <span className="sr-only">
                                            {link.name}
                                        </span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    {link.name}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    );
                })}
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                to="/dashboard/settings"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
        </aside>
    );
}
