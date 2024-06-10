import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "~/app/cookie.server";
import invariant from "tiny-invariant";

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.orderId, "param orderId not found");

    const session = await getSession(request);
    if (session.roles === "sales-person") {
        return;
    }

    // await deleteOrder(params.orderId, session.groupId)

    return redirect("/dashboard/order");
}
