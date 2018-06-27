const auth  = require('@feathersjs/authentication');
const jwt   = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const hooks = require('./hooks');

/**
 * Configure authentication
 * @param app
 */

module.exports = app => {
    const config = app.get('authentication');

    app.configure(auth(config));
    app.configure(jwt());
    app.configure(local());
    app.configure(local({
        name: 'local-username',
        usernameField: 'username'
    }));

    app.service('/api/auth').hooks(hooks(config));
};
