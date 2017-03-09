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
  var props = require('../../../../reapps-properties.json'),
      navApp = require('../../../navapp/navapp.js'),
      winston = require('winston');
    
  winston.log('info','Building NavApp!');
  navApp.build( !argv.t, !argv.d );
}