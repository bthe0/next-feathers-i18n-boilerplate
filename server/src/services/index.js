const users = require('./users');
const auth  = require('./auth');
const mails = require('./mails');

/**
 * Loads the services and registers them
 */

const services = [
    users,
    auth,
    mails
];

module.exports = function(app) {
    for(const service of services) {
        app.configure(service);
    }
};