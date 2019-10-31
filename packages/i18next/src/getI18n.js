import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import ChainedBackend from 'i18next-chained-backend';

import * as _ from 'lodash';

function getI18n(options) {
    let backends = [XHR];
    let backendOptions = [{
        loadPath: (options.contextPath ? options.contextPath : '') + '/modules/{{ns}}/javascript/locales/{{lng}}.json'
    }];

    /* eslint-disable-next-line */
    if (__webpack_require__) {
        backends.splice(0, 0, XHR);
        backendOptions.splice(0, 0, {
            loadPath: '{{ns}}/{{lng}}',
            ajax: (url, xhroptions, callback) => {
                let [ns, lang] = url.split('/');
                let value;
                try {
                    if (options.namespaceResolvers && options.namespaceResolvers[ns]) {
                        value = options.namespaceResolvers[ns](lang);
                    } else {
                        value = require('@jahia/' + ns + '/resources/locales/' + lang + '.json');
                    }
                } catch (e) {
                    // Not found
                    console.error(e);
                }

                if (value) {
                    callback(JSON.stringify(value), {status: 200});
                } else {
                    callback(null, {status: 400});
                }
            }
        }
        );
    }

    let defaults = {
        fallbackLng: 'en',
        debug: true,

        interpolation: {
            escapeValue: false // Not needed for react!!
        },

        // React i18next special options (optional)
        react: {
            wait: true,
            bindI18n: 'languageChanged loaded',
            bindStore: 'added removed',
            nsMode: 'default'
        },

        backend: {
            backends: backends,
            backendOptions: backendOptions
        }
    };

    options = _.merge(defaults, options);

    i18n
        .use(ChainedBackend)
        .init(options);
    return i18n;
}

export {getI18n};
