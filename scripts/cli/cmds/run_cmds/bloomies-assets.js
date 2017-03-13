var bloomiesAssets = require( '../../../bloomies-assets/bloomies-assets.js' ),
    winston = require('winston');

exports.command = 'bloomies-assets [offline]'
exports.desc = 'Run BloomiesAssets'
exports.builder = {
  'offline': {
    default: false,
    alias: 'o'
  }
}
exports.handler = function (argv) {
  var messageOffline = argv.o ? "offline": "online";
  winston.log('info',`Running BloomiesAssets ${messageOffline}!`);
  bloomiesAssets.run( argv.offline );
}