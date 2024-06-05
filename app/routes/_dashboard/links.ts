import { SquaresPlusIcon } from "@heroicons/react/24/outline";
import { Home, Package, ShoppingCart, User, Users2 } from "lucide-react";

export const links = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
    },
    {
        name: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingCart,
    },
    {
        name: "Products",
        href: "/dashboard/products",
        icon: Package,
    },
    {
        name: "Customers",
        href: "/dashboard/customers",
        icon: Users2,
    },
    {
        name: "Categories",
        href: "/dashboard/categories",
        icon: SquaresPlusIcon,
    },
    {
        name: "User Management",
        href: "/dashboard/user-management",
        icon: User,
    },
];
