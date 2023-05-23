import {useRef} from 'react';
import deepEquals from 'fast-deep-equal';

export const useDeepCompareMemoize = <T>(value: T) => {
    const ref = useRef<T>(value);

    if (!deepEquals(value, ref.current)) {
        ref.current = value;
    }

    return ref.current;
};
