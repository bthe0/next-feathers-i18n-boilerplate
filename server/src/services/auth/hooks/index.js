const auth  = require('@feathersjs/authentication');
const populateUser = require('./populate.user');

/**
 * Authentication hooks
 * @param config
 */

module.exports = config => ({
    before: {
        create: [
            auth.hooks.authenticate(config.strategies)
        ],
        remove: [
            auth.hooks.authenticate('jwt')
        ]
    },
    after: {
        create: [
            populateUser()
        ]
    }
});