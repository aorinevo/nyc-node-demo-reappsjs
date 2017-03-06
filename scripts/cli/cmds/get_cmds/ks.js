var props = require('../../../../reapps-properties.json'),
    utils = require('../../../utils/utils.js'),
    navApp = require('../../../navapp/navapp.js'),
    shopApp = require('../../../shopapp/shopapp.js'),
    winston = require('winston');

exports.command = 'ks <app>'
exports.desc = 'Get conents of <app> zookeeper file'
exports.builder = {}
exports.handler = function (argv) {
  switch(argv.app){
    case 'navapp':
      navApp.get.killSwitches();
      break;
    case 'shopapp':
      shopApp.get.killSwitches();
      break;
    default:
      winston.log('error', `There is no zookeeper file for ${argv.app}`);
  }  
}