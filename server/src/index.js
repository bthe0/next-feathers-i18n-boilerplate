process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const logger      = require('winston');
const makeApp     = require('./core/app');
const { nextApp } = require('./core/next');

/**
 * Handle unexpected errors
 */

process.on('unhandledRejection', (reason, p) => logger.error(reason, p));

/**
 * Prepare next.js and listen
 */

(async () => {
    const app  = await makeApp();
    const port = app.get('port');

    await nextApp.prepare();
    app.listen(port, () => logger.info(`(${process.env.NODE_ENV}): o/: ${port}`));
})();