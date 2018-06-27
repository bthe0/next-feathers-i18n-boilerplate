const Router = require('next-routes')();
const config = require('../config/shared.json');

/**
 * All application routes
 * @type {*[]}
 */

const routes = [
    {
        name: 'login',
        path: '/login',
        page: 'auth/login'
    },
    {
        name: 'register',
        path: '/register',
        page: 'auth/register'
    },
    {
        name: 'panel',
        path: '/panel',
        page: 'user/index'
    },
    {
        name: 'verify',
        path: '/verify/:token',
        page: 'user/verify'
    },
    {
        name: 'reset',
        path: '/reset/:token?',
        page: 'user/reset'
    },
    {
        name: 'home',
        path: '',
        page: 'index'
    }
];

/**
 * Register the routes
 */

const languages = config.languages.join('|');

for (const route of routes) {
    Router.add(route.name, route.path === '' ? '/' : route.path, route.page);
    Router.add(`localized-${route.name}`, `/:lang(${languages})${route.path}`, route.page);
}

module.exports = Router;