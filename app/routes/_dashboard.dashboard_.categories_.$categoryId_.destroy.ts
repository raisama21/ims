import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "../cookie.server";
import invariant from "tiny-invariant";
import deleteCategory from "../lib/actions/categories/delete";

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.categoryId, "param categoryId not found");

    const session = await getSession(request);
    if (session.roles === "sales-person") {
        return redirect("/dashboard/categories");
    }

    await deleteCategory(params.categoryId, session.groupId);

    return redirect("/dashboard/categories");
}
