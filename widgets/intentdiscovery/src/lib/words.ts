const stopWords = new Set([
    "a","the","for","to","of","in","on","and","or","with"
])

export function countValidWords(text: string): number {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word))
        .length
}