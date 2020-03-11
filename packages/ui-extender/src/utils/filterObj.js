const filterObj = (obj, predicate) => {
    if (typeof obj !== 'object') {
        return obj;
    }

    return Object.keys(obj).reduce(
        (acc, key) => predicate(obj[key]) ? {
            ...acc,
            [key]: filterObj(obj[key], predicate)
        } : acc,
        {}
    );
};

export {filterObj};
