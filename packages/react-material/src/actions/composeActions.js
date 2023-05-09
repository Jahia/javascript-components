import * as _ from 'lodash';

function composeActions(...actions) {
    return _.reduce(actions, (acc, action) => {
        if (action) {
            _.forEach(action, (value, key) => {
                const previous = acc[key];
                if (typeof previous === 'function') {
                    acc[key] = function () {
                        this.previous(...actions);
                        this.value(...actions);
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
