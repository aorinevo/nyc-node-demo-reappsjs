var navApp = require( '../../../navapp/navapp.js' ),
    winston = require('winston');
    
exports.command = 'navapp [offline]'
exports.desc = 'Run NavApp'
exports.builder = {
  'offline': {
    default: false,
    alias: 'o'
  }
}
exports.handler = function (argv) {
  winston.log('info', 'Running NavApp!');
  navApp.run( argv.offline );
}