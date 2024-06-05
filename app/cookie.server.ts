import "dotenv/config";
import { createCookie } from "@remix-run/node";

let secret = process.env.COOKIE_SECRET || "default";
if (secret === "default") {
    console.warn("No COOKIE_SECRET set, the app is insecure");

    secret = "default-secret";
}

export let authCookie = createCookie("__auth", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [secret],
    maxAge: 60 * 60 * 24 * 3, // 3 days
});

export let productCategoriesCookie = createCookie("product-categories", {
    httpOnly: true,
    path: "/dashboard/categories",
    sameSite: "lax",
    secrets: [secret],
    maxAge: 60 * 60 * 24 * 3, // 3 days
});

export type Session = {
    userId: string;
    groupId: string;
    roles: "admin" | "product-manager" | "sales-person";
};

export async function getSession(request: Request) {
    const cookieString = request.headers.get("Cookie");
    const session = (await authCookie.parse(cookieString)) as Session;

    return session;
}
