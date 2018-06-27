const nanoid = require('nanoid');
const { view, url } = require('../../../lib/misc');
const { STATUS_VERIFIED } = require('../../../../../shared/constants');
const { SKIP } = require('@feathersjs/feathers');

/**
 * Hook that handles user verification process
 * @returns {function(*)}
 */

module.exports = () => {

    /**
     * Sends an user activation email if after,
     * if before, set the activation token
     */

    return async ctx => {
        const { app, result, data } = ctx;

        /**
         * Used for validating the token and
         * handling the activation
         */

        if (ctx.type === 'before') {
            const { verify, token } = data;

            if (!verify ) {
                return ctx;
            }

            if (!token) {
                throw new Error('Missing verification token.');
            }

            const { data: users } = await app.service('/api/users').find({
                query: {
                    verifyToken: token
                }
            });

            if (!users.length) {
                throw new Error('User does not exist.');
            }

            await app.service('/api/users').patch(users[0]._id, {
                status: STATUS_VERIFIED,
                verifyToken: ''
            });

            ctx.result = {
                success: true
            };

            return SKIP;
        }

        /**
         * Used after register for
         * creating the verify token
         */

        if (ctx.type === 'after') {
            const i18n  = app.get('i18n');
            const token = nanoid();

            /**
             * Save the token and submit the email
             */

            await Promise.all([
                app.service('/api/users').patch(result._id, {
                    verifyToken: token
                }),
                app.service('/api/mails').create({
                    from: 'activate@activate.com',
                    to: result.email,
                    subject: 'Activate account',
                    html: view('mails/verify', {
                        url: url(`/${result.locale}/verify/${token}`),
                        t(key) {
                            return i18n.t(key, { lng: result.locale });
                        }
                    })
                })
            ]);

            return ctx;
        }
    };
};