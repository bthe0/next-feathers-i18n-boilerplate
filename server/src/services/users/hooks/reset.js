const nanoid = require('nanoid');
const { view, url } = require('../../../lib/misc');
const { SKIP } = require('@feathersjs/feathers');
const moment = require('moment');

/**
 * Hook that handles password reset process
 * @returns {function(*)}
 */

module.exports = () => {

    /**
     * Sends an user reset email if no token,
     * if token, tries updating password
     */

    return async ctx => {
        const { app, data } = ctx;
        const { reset, email, token, password } = data;

        /**
         * If not requesting reset, skip hook
         */

        if (!reset) {
            return ctx;
        }

        /**
         * If an email is given,
         * send the password reset email
         */

        if (email) {
            const i18n  = app.get('i18n');
            const token = nanoid();

            /**
             * Get the user
             */

            const { data: users } = await app.service('/api/users').find({
                query: {
                    email
                }
            });

            if (!users.length) {
                throw new Error('User does not exist.');
            }

            /**
             * Save the token and submit the email
             */

            await Promise.all([
                app.service('/api/users').patch(users[0]._id, {
                    resetToken: token,
                    resetDate: moment()
                }),
                app.service('/api/mails').create({
                    from: 'reset@activate.com',
                    to: email,
                    subject: 'Reset account',
                    html: view('mails/reset', {
                        url: url(`/${users[0].locale}/reset/${token}`),
                        t(key) {
                            return i18n.t(key, { lng: users[0].locale });
                        }
                    })
                })
            ]);

            return SKIP;
        }

        /**
         * If a token is provided,
         * try updating the password
         */

        if (token) {
            if (!password) {
                throw new Error('Missing password parameter.');
            }

            const { data: users } = await app.service('/api/users').find({
                query: {
                    resetToken: token
                }
            });

            if (!users.length) {
                throw new Error('User does not exist.');
            }

            let resetDate = moment(users[0].resetDate);

            if (resetDate.isBefore(moment().subtract('1', 'day'))) {
                throw new Error('The token has expired.');
            }

            if (users[0].resetToken !== token) {
                throw new Error('Invalid reset token.');
            }

            await app.service('/api/users').patch(users[0]._id, {
                password,
                resetToken: null,
                resetDate: null
            });

            ctx.result = {
                success: true
            };

            return SKIP;
        }
    };
};