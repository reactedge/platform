export type Translator = (
    key: string,
    ...args: (string | number)[]
) => string;

export function createTranslator(
    translations?: Record<string, string>
): Translator {
    return (key: string, ...args: (string | number)[]) => {
        let translated = translations?.[key] ?? key;

        // Replace %1, %2, %3...
        args.forEach((arg, index) => {
            const position = index + 1;
            translated = translated.replace(
                new RegExp(`%${position}`, 'g'),
                String(arg)
            );
        });

        // Optional: support legacy %s fallback
        let argIndex = 0;
        translated = translated.replace(/%s/g, () =>
            argIndex < args.length ? String(args[argIndex++]) : '%s'
        );

        return translated;
    };
}