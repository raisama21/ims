import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getSession } from "~/app/cookie.server";
import deleteCustomer from "~/app/lib/actions/customers/delete";

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.customerId, "params customerId not found");

    const session = await getSession(request);
    if (session.roles === "sales-person") {
        return;
    }

    await deleteCustomer(params.customerId, session.groupId);

    return redirect("/dashboard/customers");
}
