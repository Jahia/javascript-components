import {createStore} from 'redux';
import * as _ from 'lodash';

const reducers = {};

const reduxStore = (function () {
    let debugTool;
    if (typeof window !== 'undefined') {
        debugTool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
            name: 'DX Redux',
            instanceId: 'dx'
        });
    }

    return createStore((state = {}, action = null) => _.mapValues(reducers, (value, key) => value(state[key], action)), debugTool);
})();

const resetStateReducer = function (state, action) {
    if (action.type === 'RESET_STATE') {
        return undefined;
    }

    return state;
};

export {reducers, reduxStore, resetStateReducer};
