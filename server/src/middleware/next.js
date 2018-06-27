const { handle, isFeathers } = require('../core/next');

/**
 * Checks if the url should be served by feathers or next
 * @returns {function(*=, *=, *)}
 */

module.exports = () => {
    return (req, res, next) => {
        if (isFeathers(req.originalUrl)) {
            return next();
        }

        return handle(req, res);
    }
};

