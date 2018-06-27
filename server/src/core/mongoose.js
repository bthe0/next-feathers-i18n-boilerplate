const mongoose = require('mongoose');

/**
 * Creates the database connection
 * @param app
 */

module.exports = app => {
    mongoose.connect(app.get('mongodb'), {});
    mongoose.Promise = global.Promise;

    app.set('mongoose', mongoose);
};
