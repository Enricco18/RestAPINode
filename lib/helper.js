const crypto = require('crypto');
const config = require('../config');

const helper = {};

helper.hash = function (str) {
    if (!(typeof (str) === "string" && str.length > 0)) {
        return false;
    }
    const hash = crypto.createHmac('sha256', config.secret).update(str).digest('hex');
    return hash;
}
module.exports = helper;