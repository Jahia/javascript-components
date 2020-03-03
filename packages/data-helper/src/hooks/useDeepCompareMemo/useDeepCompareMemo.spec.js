import {useDeepCompareMemoize} from './index';

jest.mock('react', () => {
    let current;

    return ({
        useRef: v => {
            if (!current) {
                current = v;
            }

            return ({
                current
            });
        }
    });
});

describe('useDeepCompareMemoize', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should return the same value', () => {
        const origValue1 = ['v1'];
        const origValue2 = ['v1'];
        let value1 = useDeepCompareMemoize(origValue1);
        let value2 = useDeepCompareMemoize(origValue2);

        expect(origValue1 === origValue2).toBe(false);
        expect(value1 === value2).toBe(true);
    });

    it('should not return the same value', () => {
        const origValue1 = ['v1'];
        const origValue2 = ['v2'];
        let value1 = useDeepCompareMemoize(origValue1);
        let value2 = useDeepCompareMemoize(origValue2);

        expect(origValue1 === origValue2).toBe(false);
        expect(value1 === value2).toBe(false);
    });
});
