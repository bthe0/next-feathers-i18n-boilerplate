const i18next    = require('i18next');
const XHR        = require('i18next-xhr-backend');
const DetectLang = require('i18next-browser-languagedetector');
const config     = require('../config/shared.json');

const options = {
    fallbackLng: 'en',
    load: 'languageOnly',
    ns: ['misc'],
    defaultNS: 'misc',
    debug: false,
    saveMissing: false,
    interpolation: {
        escapeValue: false,
        formatSeparator: ',',
        format: (value, format, lng) => {
            if (format === 'uppercase') {
                return value.toUpperCase();
            }

            return value
        }
    }
};

const i18nInstance = i18next;

if (process.browser) {
    class Detector extends DetectLang {
        detect() {
            let split = window.location.pathname.split('/');

            if (config.languages.indexOf(split[1]) > -1) {
                return split[1];
            }

            return config.fallbackLang;
        }
    }

    const detector = new Detector(null, {
        order: ['path']
    });

    i18nInstance.use(XHR).use(detector);
}

if (!i18nInstance.isInitialized) {
    i18nInstance.init(options);
}

/**
 * Function is passed to page props
 * @param req
 * @param namespaces
 * @returns {{i18n, initialI18nStore: {}, initialLanguage}}
 */

const getInitialProps = (req, namespaces) => {
    if (!namespaces) {
        namespaces = i18nInstance.options.defaultNS;
    }

    if (typeof namespaces === 'string') {
        namespaces = [namespaces];
    }

    req.i18n.toJSON = () => null;

    const initialI18nStore = {};

    req.i18n.languages.forEach(lang => {
        initialI18nStore[lang] = {};
        namespaces.forEach((ns) => {
            initialI18nStore[lang][ns] = (req.i18n.services.resourceStore.data[lang] || {})[ns] || {}
        });
    });

    return {
        i18n: req.i18n,
        initialI18nStore,
        initialLanguage: req.i18n.language
    }
};

module.exports = {
    getInitialProps,
    i18nInstance,
    I18n: i18next.default
};