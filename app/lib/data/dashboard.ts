import sql from "~/app/db.server";

export async function getTotalRevenue(groupId: string) {
    try {
        const order = await sql<{ total: number }[]>`
            SELECT total FROM orders WHERE group_id = ${groupId}
        `;

        let totalRevenue = 0;
        for (let i = 0; i < order.length; i++) {
            totalRevenue += Number(order[i].total);
        }

        return totalRevenue;
    } catch (error) {
        console.log("error while getting total from 'order' ", error);
    }
}

export async function getTotalCustomer(groupId: string) {
    try {
        const [customer] = await sql<{ count: number }[]>`
            SELECT COUNT(*) FROM customers WHERE group_id = ${groupId}
       `;

        return customer;
    } catch (error) {
        console.log("error while getting 'customers' count: ", error);
    }
}

export async function getPaidAmount(groupId: string) {
    try {
        const [payment] = await sql<{ total: number }[]>`
            SELECT orders.total FROM payments 
            INNER JOIN orders ON payments.order_id = orders.id
            WHERE payments.status = 'paid' AND orders.group_id = ${groupId}
       `;

        return payment;
    } catch (error) {
        console.log("error while getting 'customers' count: ", error);
    }
}

export async function getPendingAmount(groupId: string) {
    try {
        const [payment] = await sql<{ total: number }[]>`
            SELECT orders.total FROM payments 
            INNER JOIN orders ON payments.order_id = orders.id
            WHERE payments.status = 'pending' AND orders.group_id = ${groupId}
       `;

        return payment;
    } catch (error) {
        console.log("error while getting 'customers' count: ", error);
    }
}
