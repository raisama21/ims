import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getSession } from "~/app/cookie.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);

    if (session) {
        return redirect("/dashboard");
    }

    return null;
}

export default function AuthLayout() {
    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <Outlet />

            <div className="hidden bg-muted lg:block"></div>
        </div>
    );
}
