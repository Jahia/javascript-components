import {Service} from './service';

function composeServices(...services: Partial<Service>[]): Partial<Service> {
    return services.reduce((acc, service) => {
        if (service) {
            Object.entries(service).forEach(([key, value]) => {
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
            });
        }

        return acc;
    }, {});
}

export {composeServices};
