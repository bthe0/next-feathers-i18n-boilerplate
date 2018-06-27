process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const feathers = require('@feathersjs/feathers');
const config   = require('@feathersjs/configuration');
const Agenda   = require('agenda');
const testJob  = require('./jobs/test.job');

/**
 * Create a feathers instance
 */

const app = feathers();

app.configure(config());

/**
 * Create the agenda object
 * @type {*|Agenda}
 */

const agenda = new Agenda({
    db: {
        address: app.get('mongodb'),
        collection: 'jobs'
    }
});

/**
 * Define jobs
 */

agenda.define('test:job', testJob);

/**
 * Run the agenda
 */

agenda.on('ready', () => {
    agenda.every('*/1 * * * *', 'test:job');
    agenda.start();
});