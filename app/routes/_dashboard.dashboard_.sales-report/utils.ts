import { SalesReport } from "~/app/lib/data/sales";

export function calculateGrandTotal(salesReport: SalesReport[] | undefined) {
    if (!salesReport) {
        return;
    }

    let grandTotal = 0;

    for (const sale of salesReport) {
        grandTotal += Number(sale.total);
    }

    return grandTotal;
}

export function calculateProfit(salesReport: SalesReport[] | undefined) {
    if (!salesReport) {
        return;
    }

    let profit = 0;
    for (const sale of salesReport) {
        profit +=
            Number(sale.purchase_price) * Number(sale.quantity) -
            Number(sale.selling_price);
    }

    return profit;
}
