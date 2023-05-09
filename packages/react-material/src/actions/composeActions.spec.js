import {composeActions} from './composeActions';

describe('composeActions', () => {
    it('should call the tow action function', () => {
        const action = composeActions({

            onInit: context => {
                context.tata = 45;
            }
        }, {
            onInit: context => {
                context.toto = 42;
            }
        });

        const context = {};
        action.onInit(context);

        expect(context).toEqual({toto: 42, tata: 45});
    });
});
