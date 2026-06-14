export const getOrderNumber = (orderNumber: number) => {
    const newNumber = String(orderNumber).padStart(5, '0');
    return `RAC${newNumber}`
}

