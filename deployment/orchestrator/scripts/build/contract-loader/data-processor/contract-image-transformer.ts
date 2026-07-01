export class ContractImageTransformer {
    async transform<T>(
        value: T,
        replacements: Map<string, string>
    ): Promise<T> {

        if (typeof value === 'string') {

            return (
                replacements.get(value) ??
                value
            ) as T;
        }

        if (Array.isArray(value)) {

            return Promise.all(
                value.map(child =>
                    this.transform(child, replacements)
                )
            ) as Promise<T>;
        }

        if (
            value &&
            typeof value === 'object'
        ) {

            return Object.fromEntries(
                await Promise.all(
                    Object.entries(value).map(async ([key, child]) => [
                        key,
                        await this.transform(
                            child,
                            replacements
                        )
                    ])
                )
            ) as T;
        }

        return value;
    }
}