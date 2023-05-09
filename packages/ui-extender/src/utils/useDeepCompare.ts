import {useRef} from 'react';
import deepEquals from 'fast-deep-equal';

export const useDeepCompare = (newValue: unknown) => {
    const valueRef = useRef(null);
    const isNew = !valueRef.current;
    const isChanged = !isNew && !deepEquals(newValue, valueRef.current);

    if (isChanged || isNew) {
        valueRef.current = newValue;
    }

    const value = valueRef.current;

    return {isNew, isChanged, value};
};
