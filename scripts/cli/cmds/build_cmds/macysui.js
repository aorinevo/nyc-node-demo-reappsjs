var props = require('../../../../reapps-properties.json'),
    macysUi = require('../../../macysui/macysui.js'),
    winston = require('winston');

exports.command = 'macysui [t] [d]'
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
  winston.log('info',`Building MacysUI, ${messageTests} tests, and ${messageEnforcer} enforcer!`);
  macysUi.build( !argv.t, !argv.d );
}