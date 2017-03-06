exports.command = 'bloomies-assets [t] [d]'
exports.desc = 'Build BloomiesAssets'
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
  var props = require('../../../reapps-properties.json'),
      bloomiesAssets = require( '../../bloomies-assets/bloomies-assets.js' ),
      winston = require('winston'); 
      
  winston.log('info','Building BloomiesAssets!');
  bloomiesAssets.build( argv.t, argv.d );
}