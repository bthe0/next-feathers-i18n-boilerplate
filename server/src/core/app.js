const path       = require('path');
const favicon    = require('serve-favicon');
const compress   = require('compression');
const cors       = require('cors');
const helmet     = require('helmet');
const logger     = require('winston');
const feathers   = require('@feathersjs/feathers');
const config     = require('@feathersjs/configuration');
const express    = require('@feathersjs/express');
const middleware = require('../middleware/index');
const services   = require('../services/index');
const appHooks   = require('../hooks');
const channels   = require('./channels');
const mongoose   = require('./mongoose');
const i18i       = require('../../../shared/i18n').i18nInstance;
const i18nm      = require('i18next-express-middleware');
const Backend    = require('i18next-node-fs-backend');
const Detector   = require('../lib/lang.detector');
const sharedCfg  = require('../../../config/shared.json');

/**
 * Initialize i18n
 * @returns {Promise<any>}
 */

const loadi18n = () => new Promise((resolve, reject) => {
    const opts = {
        fallbackLng: sharedCfg.fallbackLang,
        preload: sharedCfg.languages,
        ns: ['misc'],
        backend: {
            loadPath: path.resolve('./server/resources/lang/{{lng}}/{{ns}}.json'),
            addPath: path.resolve('./server/resources/lang/{{lng}}/{{ns}}.missing.json')
        },
        detection: {
            order: ['path']
        }
    };

    const detector = new Detector({
        languages: sharedCfg.languages,
        fallbackLang: sharedCfg.fallbackLang
    });

    i18i.use(Backend).use(detector).init(opts, resolve);
});

/**
 * Export the application
 * @returns {Promise<any>}
 */

module.exports = async () => {
    /**
     * Load the configuration object
     */

    const app = express(feathers());
    app.configure(config());


    /**
     * Register global variables
     */

    global.APP_URL = app.get('baseUrl');

    /**
     * Initialize i18n and return the app object
     */

    await loadi18n();

    app.set('i18n', i18i);

    app.use(i18nm.handle(i18i));
    app.use(cors());
    app.use(helmet());

    if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

/*    app.use('/static', express.static(path.resolve('./client/.static')));*/
    app.use('/locales', express.static(path.resolve('./server/resources/lang')));

    app.configure(express.rest());
    app.configure(mongoose);

    app.configure(middleware);
    app.configure(services);
    app.configure(channels);

    app.use(express.notFound());
    app.use(express.errorHandler({ logger }));

    app.hooks(appHooks);
    return Promise.resolve(app);
};
