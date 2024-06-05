import { Outlet, useLoaderData } from "@remix-run/react";
import SideNavigationBar from "./side-navigation-bar";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import Header from "./header";
import { authCookie, getSession } from "~/app/cookie.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);

    if (!session) {
        return redirect("/login", {
            headers: {
                "Set-Cookie": await authCookie.serialize("", {
                    maxAge: 0,
                }),
            },
        });
    }

    return { session };
}

export default function DashboardLayout() {
    const loaderData = useLoaderData<typeof loader>();

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <SideNavigationBar session={loaderData.session}/>

            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header />

                <Outlet />
            </div>
        </div>
    );
}
