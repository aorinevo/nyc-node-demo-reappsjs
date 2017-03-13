var props = require('../../../../reapps-properties.json'),
    navApp = require('../../../navapp/navapp.js'),
    winston = require('winston');

exports.command = 'navapp [t] [d]'
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
  winston.log('info',`Building NavApp, ${messageTests} tests, and ${messageEnforcer} enforcer!`);
  navApp.build( !argv.t, !argv.d );
}