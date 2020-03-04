import {useRef} from 'react';
import deepEquals from 'fast-deep-equal';

export const useDeepCompareMemoize = value => {
    const ref = useRef(value);

    if (!deepEquals(value, ref.current)) {
        ref.current = value;
    }

    return ref.current;
};
