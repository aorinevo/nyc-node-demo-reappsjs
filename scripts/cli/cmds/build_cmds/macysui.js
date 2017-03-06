exports.command = 'macysui [t] [d]'
exports.desc = 'Build MacysUI'
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
  var props = require('../../../../reapps-properties.json'),
      macysUi = require('../../../macysui/macysui.js'),
      winston = require('winston');
      
  winston.log('info','Building MacysUI!');
  macysUi.build( !argv.t, !argv.d );
}