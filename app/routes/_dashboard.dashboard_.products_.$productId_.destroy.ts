import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getSession } from "~/app/cookie.server";
import deleteProduct from "~/app/lib/actions/products/delete";

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.productId, "params productId not found");

    const session = await getSession(request);
    if (session.roles === "sales-person") {
        return;
    }

    await deleteProduct(params.productId, session.groupId);

    return redirect("/dashboard/products");
}
