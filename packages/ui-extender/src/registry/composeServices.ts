import {Service} from './service';

/** Value-aware merging of service objects */
export function composeServices(...services: Array<Partial<Service>>): Partial<Service> {
    const acc: Partial<Service> = {};
    for (const service of services) {
        if (!service) {
            continue;
        }

        for (const [key, value] of Object.entries(service)) {
            const previous = acc[key];
            if (typeof previous === 'function' && typeof value === 'function') {
                // If function, override the function but pass the previous one as the last parameter
                // Do not convert the following function to a lambda otherwise the arguments will not be coming from the right context
                acc[key] = function (...params: unknown[]) {
                    return value.apply(this, [...params, previous]);
                };
            } else if (Array.isArray(previous) && Array.isArray(value)) {
                // Concatenate arrays
                acc[key] = [...previous, ...value];
            } else {
                // Simply replaces the value
                acc[key] = value;
            }
        }
    }

    return acc;
}
