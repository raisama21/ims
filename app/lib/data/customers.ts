import sql from "~/app/db.server";
import { Customers } from "~/app/lib/defitions";

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

export type CustomerData = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    street_address?: string;
    city?: string;
    provience?: string;
    postal_code: number;
};

export async function getOneCustomerData(customerId: string, groupId: string) {
    try {
        const [customer] = await sql<CustomerData[]>`
            SELECT 
                customers.id,
                customers.first_name,
                customers.last_name,
                customers.email,
                customers.phone_number,
                customer_address.street_address,
                customer_address.city,
                customer_address.provience,
                customer_address.postal_code
            FROM customers 
            INNER JOIN customer_address 
                ON customer_address.customer_id = customers.id
            WHERE customers.id = ${customerId} AND customers.group_id = ${groupId}
       `;

        return customer;
    } catch (error) {
        console.log("error while getting one customer: ", error);
    }
}
