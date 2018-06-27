const {
    authenticate
} = require('@feathersjs/authentication').hooks;

const {
    restrictToOwner
} = require('feathers-authentication-hooks');

const {
    hashPassword,
    protect
} = require('@feathersjs/authentication-local').hooks;

const {
    softDelete,
    discard,
    iff,
    isProvider
} = require('feathers-hooks-common');

const verify = require('./verify');
const reset = require('./reset');

module.exports = {
    before: {
        all: [
            softDelete(),
            iff(isProvider('external'), discard('verifyToken', 'status'))
        ],
        find: [
            authenticate('jwt')
        ],
        get: [
            authenticate('jwt')
        ],
        create: [
            hashPassword()
        ],
        update: [
            verify(),
            hashPassword(),
            reset(),
            authenticate('jwt')
        ],
        patch: [
            hashPassword(),
            authenticate('jwt')
        ],
        remove: [
            authenticate('jwt')
        ]
    },

    after: {
        all: [
            protect('password')
        ],
        find: [],
        get: [],
        create: [
            verify()
        ],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
