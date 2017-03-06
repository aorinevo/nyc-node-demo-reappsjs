var props = require('../../../../reapps-properties.json'),
  utils = require('../../../utils/utils.js'),
  navApp = require('../../../navapp/navapp.js'),
  shopApp = require('../../../shopapp/shopapp.js'),
  winston = require('winston');
console.log('test1');
exports.command = 'ks <app> [k]'
exports.desc = 'Updates or adds kill switches from [k] to <app> zookeeper file'
exports.builder = {
  'killSwitchList': {
    alias: 'k',
    default: ""
  }
}
exports.handler = function (argv) {
  console.log('test1');
  switch(argv.app){
    case 'navapp':
      navApp.update.ks( argv.k );
      break;
    case 'shopapp':   
        console.log('test');
      shopApp.update.ks( argv.k );
      break;
    default:
      winston.log('error', `There is no zookeeper file for ${argv.app}`);
  }  
}