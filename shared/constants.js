const { apiUrl } = require('../config/shared.json');

/**
 * Misc settings
 */

exports.API_URL = apiUrl;

/**
 * Account statuses
 */

exports.STATUS_NEW      = 0;
exports.STATUS_VERIFIED = 1;
exports.STATUS_BANNED   = 2;