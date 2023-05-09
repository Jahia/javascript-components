import * as _ from 'lodash';
import {composeActions} from './composeActions';

class Registry {
    constructor() {
        this.registry = {};
    }

    add(key, ...actions) {
        const action = composeActions(this.registry[key], ...actions);
        action.key = key;

        if (action.target) {
            action.target = _.map(action.target, t => {
                if (typeof t === 'string') {
                    const spl = t.split(':');
                    return ({id: spl[0], priority: spl[1] ? spl[1] : 0});
                }

                return t;
            });
        }

        this.registry[key] = action;
    }

    get(key) {
        return this.registry[key];
    }

    getAll() {
        return _.values(this.registry);
    }
}

const actionsRegistry = new Registry();

export {actionsRegistry};
