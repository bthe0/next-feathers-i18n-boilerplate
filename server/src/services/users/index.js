const createService = require('feathers-mongoose');
const createModel   = require('../../models/user');
const hooks         = require('./hooks');

/**
 * Users service
 * @param app
 */

module.exports = app => {
  const Model    = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  app.use('/api/users', createService(options));
  app.service('/api/users').hooks(hooks);
};
