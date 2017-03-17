var props = require('../../../../reapps-properties.json'),
    utils = require('../../../utils/utils.js'),
    winston = require('winston'),
    responseBody = null;

exports.command = 'listEnvs [branch] [brand]'
exports.desc = 'Lists environments based on [branch] and [brand]'
exports.builder = {
  'branch': {
    alias: 'b',
    default: props.branch
  },
  'brand': {
    alias: 'r',
    default: props.brand
  }
}
exports.handler = function (argv) {
  return utils.listEnvs( responseBody ).then(function( result ){
    responseBody = result;
  }); 
}