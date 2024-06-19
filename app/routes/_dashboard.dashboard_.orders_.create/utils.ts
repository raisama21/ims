export function calculateNetAmount(
    subTotal: number,
    discountInPercentage: number,
    deliveryCharge: number
) {
    let total = 0;

    if (!discountInPercentage) {
        discountInPercentage = 0;
    }

    if (!deliveryCharge) {
        deliveryCharge = 0;
    }

    total = subTotal - (discountInPercentage / 100) * subTotal + deliveryCharge;

    return total;
}
