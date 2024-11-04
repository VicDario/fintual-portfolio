export function toSnakeCase<T extends object>(obj: T): Record<string, string> {
    const newObj: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj)) {
        const snakeCaseKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        newObj[snakeCaseKey] = String(value);
    }
    return newObj;
}
