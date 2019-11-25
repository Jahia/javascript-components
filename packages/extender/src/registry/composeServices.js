function composeServices() {
    let services = Array.prototype.slice.call(arguments);
    return services.reduce((acc, service) => {
        if (service) {
            Object.entries(service).forEach(([key, value]) => {
                let previous = acc[key];
                if (typeof previous === 'function' && typeof value === 'function') {
                    // If function, override the function but pass the previous one as the last parameter
                    acc[key] = () => {
                        value.apply(this, [...arguments, previous]);
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
