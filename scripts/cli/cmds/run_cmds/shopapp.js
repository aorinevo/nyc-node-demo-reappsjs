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
  var messageOffline = argv.o ? "online": "offline";
  winston.log('info',`Running ShopApp ${messageOffline}!`);
  shopApp.run( !argv.offline );
}