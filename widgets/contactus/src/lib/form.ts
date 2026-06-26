type FieldConfig = {
    name: string;
};

export function buildInitialValues(fields: FieldConfig[]) {
    return fields.reduce<Record<string, string>>((acc, field) => {
        acc[field.name] = '';
        return acc;
    }, {});
}