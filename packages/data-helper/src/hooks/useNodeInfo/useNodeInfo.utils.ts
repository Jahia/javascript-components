const isObject = (obj: unknown): obj is {[key:string]: any} => obj !== null && typeof obj === 'object';

export const merge = (target: {[key:string]: any}, source: {[key:string]: any}) => {
    if (Array.isArray(target) && Array.isArray(source)) {
        return [...target, ...source.filter(f => target.indexOf(f) === -1)];
    }

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(sourceKey => {
            const sourceValue: any = (source as any)[sourceKey];
            if (Object.prototype.hasOwnProperty.call(target, sourceKey)) {
                const targetValue: any = target[sourceKey];
                target[sourceKey] = merge(targetValue, sourceValue);
            } else if (Array.isArray(sourceValue)) {
                target[sourceKey] = [...sourceValue];
            } else if (typeof sourceValue === 'object') {
                target[sourceKey] = {...sourceValue};
            } else {
                target[sourceKey] = sourceValue;
            }
        });

        return target;
    }

    return target;
};

export const isSubset = (superObj:{[key:string]: any}, subObj:{[key:string]: any}):boolean => Object.keys(subObj).every(ele => {
    const obj1 = subObj[ele];
    const obj2 = superObj[ele];
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        return obj1.length === obj2.length && obj1.every((value, index) => value === obj2[index]);
    }

    if (typeof obj1 === 'object' && !Array.isArray(obj1)) {
        return isSubset(obj2, obj1);
    }

    return obj1 === obj2;
});
