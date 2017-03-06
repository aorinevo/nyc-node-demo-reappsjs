var shopApp = require( '../../../shopapp/shopapp.js' ),
    winston = require('winston');

exports.command = 'shopapp [offline]'
exports.desc = 'Run ShopApp'
exports.builder = {
  'offline': {
    default: false,
    alias: 'o'
  }
}
exports.handler = function (argv) {
  winston.log('info', 'Running ShopApp!');
  shopApp.run( !argv.offline );
}