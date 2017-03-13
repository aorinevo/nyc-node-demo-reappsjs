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
  var messageOffline = argv.o ? "online": "offline";
  winston.log('info',`Running NavApp ${messageOffline}!`);
  navApp.run( !argv.offline );
}