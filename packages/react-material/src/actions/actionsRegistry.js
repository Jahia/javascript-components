import * as _ from 'lodash';
import {composeActions} from './composeActions';

class Registry {
    constructor() {
        this.registry = {};
    }

    add(key) {
        let actions = Array.prototype.slice.call(arguments, 1);
        let action = composeActions(this.registry[key], ...actions);
        action.key = key;

        if (action.target) {
            action.target = _.map(action.target, t => {
                if (typeof t === 'string') {
                    let spl = t.split(':');
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

let actionsRegistry = new Registry();

export {actionsRegistry};
