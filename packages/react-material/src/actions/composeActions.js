import * as _ from 'lodash';

function composeActions(...actions) {
    return _.reduce(actions, (acc, action) => {
        if (action) {
            _.forEach(action, (value, key) => {
                const previous = acc[key];
                if (typeof previous === 'function') {
                    acc[key] = function (...args) {
                        previous.apply(this, args);
                        value.apply(this, args);
                    };
                } else if (Array.isArray(previous)) {
                    acc[key] = _.concat(previous, value);
                } else {
                    acc[key] = value;
                }
            });
        }

        return acc;
    }, {});
}

export {composeActions};
