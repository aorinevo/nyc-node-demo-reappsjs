exports.command = 'build [app..]'
exports.desc = 'Build <app>'
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
      shopApp = require('../../shopApp/shopapp.js'),
      navApp = require('../../navApp/navapp.js'),
      bloomiesAssets = require( '../../bloomies-assets/bloomies-assets.js' ),
      winston = require('winston'),
      app = argv.app[0];
      
      console.log(app);

  switch ( app ){
    case 'shopApp':
      winston.log('info','Building ShopApp!');
      shopApp.build( argv.t, argv.d );
      break;
    case 'navApp':
      winston.log('info','Building NavApp!');
      navApp.build( argv.t, argv.d );
      break;
    case 'macysUi':
      winston.log('info','Building MacysUI!');
      macysUi.build( argv.t, argv.d );
      break;    
    case 'bloomiesAssets':
      winston.log('info','Building BloomiesAssets!');
      bloomiesAssets.build( argv.t, argv.d );
      break;
    default:
      winston.log('error', 'Choices: are shopApp, navApp, bloomiesAssets, and macysUi');
  }
}