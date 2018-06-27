const next = require('./next');

/**
 * File containing global middlewares
 * @param app
 */

module.exports = app => {
    app.get('*', next());
};