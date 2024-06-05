import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "../cookie.server";
import invariant from "tiny-invariant";
import deleteUser from "~/app/lib/actions/users/delete";

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.userId, "param userId not found");

    const session = await getSession(request);
    if (session.roles !== "admin") {
        return;
    }

    await deleteUser(params.userId, session.groupId);

    return redirect("/dashboard/user-management");
}
