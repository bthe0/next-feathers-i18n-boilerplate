const logger = require('winston');

module.exports = () => {
    return ctx => {
        logger.debug(`${ctx.type} app.service('${ctx.path}').${ctx.method}()`);

        if (typeof ctx.toJSON === 'function') {
            logger.debug('Hook Context', JSON.stringify(ctx, null, '  '));
        }

        if (ctx.error) {
            logger.error(ctx.error);
        }
    };
};
