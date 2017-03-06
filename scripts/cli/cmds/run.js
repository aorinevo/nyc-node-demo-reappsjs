exports.command = 'run [app..]'
exports.desc = 'Run <app>'
exports.builder = {
  'offline': {
    default: false,
    alias: 'o'
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
      winston.log('info','Running ShopApp!');
      shopApp.build( argv.t, argv.d );
      break;
    case 'navApp':
      winston.log('info','Running NavApp!');
      navApp.build( argv.t, argv.d );
      break; 
    case 'bloomiesAssets':
      winston.log('info', 'Running BloomiesAssets!');
      //bloomiesAssets.build( props.username, props.paths.bloomiesAssets );
      break;
    default:
      winston.log('error', 'Choices: are shopApp, navApp, bloomiesAssets, and macysUi');
  }
}