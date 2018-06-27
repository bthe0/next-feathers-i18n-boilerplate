const _ = require('lodash');

/**
 * Hook for populating user data after authentication
 * @returns {function(*)}
 */

module.exports = () => {
    return async ctx => {
        const { params: { user } } = ctx;

        ctx.result = {
            ...ctx.result,
            user: _.pick(user, ['_id', 'email', 'name'])
        };

        return ctx;
    };
};