exports.command = 'navapp [t] [d]'
exports.desc = 'Build NavApp'
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
  console.log(argv);
  var props = require('../../../../reapps-properties.json'),
      navApp = require('../../../navapp/navapp.js'),
      winston = require('winston');
    
  winston.log('info','Building NavApp!');
  navApp.build( argv.t, argv.d );
}