'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

const _build = require('./build/js');

Object.keys(_build).forEach(key => {
    if (key === 'default' || key === '__esModule') {
        return;
    }

    Object.defineProperty(exports, key, {
        enumerable: true,
        get() {
            return _build[key];
        }
    });
});
