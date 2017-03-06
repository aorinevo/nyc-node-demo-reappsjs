var props = require('../../../../reapps-properties.json');

exports.command = 'listEnvs [branch] [brand]'
exports.desc = 'Lists environments based on [branch] and [brand]'
exports.builder = {
  'branch': {
    alias: 'b',
    default: props.branch
  },
  'brand': {
    alias: 'BCOM',
    default: props.brand
  }
}
exports.handler = function (argv) {
  console.log(argv);
  var utils = require('../../../utils/utils.js'),
      winston = require('winston'),
      responseBody = null;
  return utils.listEnvs( responseBody ).then(function( result ){
    responseBody = result;
  }); 
}