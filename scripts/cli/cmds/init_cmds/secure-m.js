var props = require('../../../../reapps-properties.json'),
    secureM = require('../../../secure-m/secure-m.js'),
    winston = require('winston');

exports.command = 'secure-m'
exports.desc = 'Initializes MobileCustomerAppUI (secure-m)'
exports.builder = {}
exports.handler = function (argv) {
  winston.log('Initializing MobileCustomerAppUI (secure-m)!');
  secureM.init( props.paths.mobileCustomerAppUi );
}

