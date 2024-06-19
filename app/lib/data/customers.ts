import sql from "~/app/db.server";
import { Customers } from "~/app/lib/defitions";

export type Status = "pendig" | "paid";
export type CustomerTableData = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: number;
    created_at: string;
    status: Status;
    total: number;
};

export async function getDataForCustomerTable(groupId: string) {
    try {
        const customer = await sql<CustomerTableData[]>`
            SELECT 
                customers.id,
                customers.first_name,
                customers.last_name,
                customers.email,
                customers.phone_number,
                customers.created_at,
                payments.status,
                orders.total
            FROM orders INNER JOIN customers
                ON orders.customer_id = customers.id
            INNER JOIN payments
                on orders.id = payments.order_id
            WHERE orders.group_id = ${groupId}
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

export async function getCustomerBasedOnPaymentStatus(
    status: Status,
    groupId: string
) {
    try {
        const customer = await sql<CustomerTableData[]>`
            SELECT 
                customers.id,
                customers.first_name,
                customers.last_name,
                customers.email,
                customers.phone_number,
                customers.created_at,
                payments.status,
                orders.total
            FROM orders INNER JOIN customers
                ON orders.customer_id = customers.id
            INNER JOIN payments
                on orders.id = payments.order_id
            WHERE orders.group_id = ${groupId} AND payments.status = ${status}
       `;

        return customer;
    } catch (error) {
        console.log("error while getting customer payment status: ", error);
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
