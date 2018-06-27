const mailer = require('feathers-mailer');
const smtp   = require('nodemailer-smtp-transport');
const hooks  = require('./hooks');

/**
 * Mails service
 * @param app
 */

module.exports = app => {
    app.use('/api/mails', mailer(smtp(app.get('mailSettings'))));
    app.service('/api/mails').hooks(hooks);
};
