var props = require('../../../../reapps-properties.json'),
  navApp = require('../../../navapp/navapp.js'),
  shopApp = require('../../../shopapp/shopapp.js'),
  winston = require('winston');
exports.command = 'ks <app> [k]'
exports.desc = 'Updates or adds kill switches from [k] to <app> zookeeper file'
exports.builder = {
  'killSwitchList': {
    alias: 'k',
    default: ""
  }
}
exports.handler = function (argv) {
  switch(argv.app){
    case 'navapp':
      navApp.update.ks( argv.k );
      break;
    case 'shopapp':   
      shopApp.update.ks( argv.k );
      break;
    default:
      winston.log('error', `There is no zookeeper file for ${argv.app}`);
  }  
}