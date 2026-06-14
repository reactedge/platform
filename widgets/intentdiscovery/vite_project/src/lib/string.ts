export const capitalise = (str: string = '') => {
    if (str === null || str == undefined || str[0] === undefined) return ''

    return str[0].toUpperCase() + str.slice(1).toLowerCase()
}

export const sanitiseString = (value: unknown) => {
    return typeof value === "string" ? value : undefined;
}

export const shortenText = (text: string, maxLength = 200) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const unescapeHtml = (html: string) => {
    let div = document.createElement("div");
    div.innerHTML = html;
    return div.innerText;
}

export const decodeHtmlEntities = (str:string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}

export function stripHtml(html?: string): string | undefined {
    return html?.replace(/<[^>]+>/g, '');
}