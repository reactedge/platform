export const capitalise = (str: string = '') => {
    if (str === null || str == undefined || str[0] === undefined) return ''

    return str[0].toUpperCase() + str.slice(1).toLowerCase()
}

export const sanitiseString = (value: unknown) => {
    return typeof value === "string" ? value : undefined;
}