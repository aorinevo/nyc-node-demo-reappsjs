var props = require('../../../../reapps-properties.json'),
  navApp = require('../../../navapp/navapp.js'),
  shopApp = require('../../../shopapp/shopapp.js'),
  winston = require('winston');
exports.command = 'sdp <app>'
exports.desc = 'Updates SDP_HOST property in <app> properties file'
exports.builder = {}
exports.handler = function (argv) {
  switch(argv.app){
    case 'navapp':
      navApp.update.sdp();
      break;
    case 'shopapp':   
      shopApp.update.sdp();
      break;
    default:
      winston.log('error', `${argv.app} should be either shopapp or navapp`);
  }  
}