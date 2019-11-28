import {composeServices} from './composeServices';

describe('composeServices', () => {
    it('should replace values', () => {
        const action = composeServices({
            value: 1
        }, {
            value: 2
        });

        expect(action.value).toEqual(2);
    });
    it('should concatenate arrays', () => {
        const action = composeServices({
            array: [1]
        }, {
            array: [2]
        });

        expect(action.array).toEqual([1, 2]);
    });
    it('should call the two action function', () => {
        const action = composeServices({
            // eslint-disable-next-line
            onInit: context => {
                context.tata = 45;
            }
        }, {
            onInit: (context, previous) => {
                previous(context);
                context.toto = 42;
            }
        });

        const context = {};
        action.onInit(context);

        expect(context).toEqual({toto: 42, tata: 45});
    });
});
