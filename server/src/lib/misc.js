const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

/**
 * Helper for generating urls
 * @param path
 * @returns {string}
 */

exports.url = (path) => {
    return `${APP_URL}${path}`;
};

/**
 * Helper for returning resource path
 * @param file
 */

exports.res = file => {
    return path.resolve(`./server/resources/${file}`);
};

/**
 * Returns a compiled view
 * @param view
 * @param params
 */

exports.view = (view, params) => {
    const template = fs.readFileSync(exports.res(`views/${view}.ejs`), 'utf-8');
    const compiler = ejs.compile(template);

    return compiler(params);
};