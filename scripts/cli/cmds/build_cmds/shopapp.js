exports.command = 'shopapp [t] [d]'
exports.desc = 'Build ShopApp'
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
      shopApp = require('../../../shopapp/shopapp.js'),
      winston = require('winston');
    
  winston.log('info','Building ShopApp!');
  shopApp.build( !argv.t, !argv.d );
}