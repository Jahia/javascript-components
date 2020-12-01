import * as _ from 'lodash';

function composeActions() {
    let actions = Array.prototype.slice.call(arguments);
    return _.reduce(actions, (acc, action) => {
        if (action) {
            _.forEach(action, (value, key) => {
                let previous = acc[key];
                if (typeof previous === 'function') {
                    acc[key] = function () {
                        previous.apply(this, arguments);
                        value.apply(this, arguments);
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
