module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */

    apps: [
        {
            name: 'API',
            script: 'server/src/index.js',
            env: {
                COMMON_VARIABLE: 'true'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        },
    ],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */

    deploy: {
        staging: {
            user: 'user',
            host: '127.0.0.1',
            ref: 'origin/master',
            repo: '',
            path: '/var/www',
            'post-deploy': 'npm install && npm run build && pm2 reload ../ecosystem.config.js --env staging',
            env: {
                NODE_ENV: 'production'
            }
        }
    }
};
