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
  winston.log('info', 'Running BloomiesAssets!');
  bloomiesAssets.run( argv.offline );
}