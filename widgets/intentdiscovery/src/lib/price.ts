export const formatMoney = (amount: number = 0) => {
    const formatter = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 2,
    });

    return formatter.format(amount);
}


export const formatRange = (str: string) => {
    const prices = str.split('-')

    return `${formatMoney(parseInt(prices[0]))} - ${formatMoney(parseInt(prices[1]))}`
}

export function formatPrice(value: number, currency: string) {
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(value)
    } catch {
        return `${value} ${currency}`
    }
}