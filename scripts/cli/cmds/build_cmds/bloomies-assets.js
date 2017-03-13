var props = require('../../../../reapps-properties.json'),
    bloomiesAssets = require( '../../../bloomies-assets/bloomies-assets.js' ),
    winston = require('winston'); 

exports.command = 'bloomies-assets [t] [d]'
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
  winston.log('info',`Building BloomiesAssets, ${messageTests} tests, and ${messageEnforcer} enforcer!`);
  bloomiesAssets.build( !argv.t, !argv.d );
}