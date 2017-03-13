var props = require('../../../../reapps-properties.json'),
    shopApp = require('../../../shopapp/shopapp.js'),
    winston = require('winston');
    
exports.command = 'shopapp [t] [d]'
exports.desc = '[t] runs tests and [d] runs enforcer'
exports.builder = {
  'test': {
    default: false,
    alias: 't'
  },
  'dEnforcer': {
    default: false,
    alias: 'd'
  }
}
exports.handler = function (argv) {
  var messageTests = argv.t ? "running": "skipping",
      messageEnforcer = argv.t ? "running" : "skipping";
  winston.log('info',`Building ShopApp, ${messageTests} tests, and ${messageEnforcer} enforcer!`);
  shopApp.build( !argv.t, !argv.d );
}