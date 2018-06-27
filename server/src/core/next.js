const next     = require('next');
const dev      = process.env.NODE_ENV !== 'production';
const nextApp  = next({ dir: './client', dev });
const routes   = require('../../../shared/routes');
const handle   = routes.getRequestHandler(nextApp);

/**
 * Validates if is an api request is for feathers
 * @param path
 * @returns {boolean}
 */

const isFeathers = path => {
    const feathersServices = [
        '/api',
        '/static',
        '/locales'
    ];

    return feathersServices.some(item => path.indexOf(item) === 0);
};

/**
 * Export handlers
 */

module.exports = {
    nextApp,
    handle,
    isFeathers
};