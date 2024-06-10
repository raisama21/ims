import sql from "~/app/db.server";
import { Customers } from "~/app/lib/defitions";

export async function getDataForCustomerTable(groupId: string) {
    try {
        const customer = await sql<Customers[]>`
            SELECT * FROM customers WHERE group_id = ${groupId}
        `;

        return customer;
    } catch (error) {
        console.log("error while getting all customers Table data: ", error);
    }
}

export async function getAllCustomers(groupId: string) {
    try {
        const customer = await sql<Customers[]>`
            SELECT * FROM customers WHERE group_id = ${groupId}
        `;

        return customer;
    } catch (error) {
        console.log("error while getting all customers: ", error);
    }
}

export async function getOneCustomer(customerId: string, groupId: string) {
    try {
        const [customer] = await sql<Customers[]>`
            SELECT * FROM customers 
            WHERE id = ${customerId} AND group_id = ${groupId}
       `;

        return customer;
    } catch (error) {
        console.log("error while getting one customer: ", error);
    }
}
