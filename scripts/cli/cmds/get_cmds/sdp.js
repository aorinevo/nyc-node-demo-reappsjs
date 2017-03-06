var props = require('../../../../reapps-properties.json');

exports.command = 'sdp'
exports.desc = 'Get sdp host ip'
exports.builder = {
  'envName': {
    alias: 'e',
    default: props.envName
  },
  'branch': {
    alias: 'b',
    default: props.branch
  }
}
exports.handler = function (argv) {
  var utils = require('../../../utils/utils.js'),
      winston = require('winston'),
      SDP_HOST = null;
  return utils.getIp( SDP_HOST ).then(function( result ){
    SDP_HOST = result;
  }); 
}