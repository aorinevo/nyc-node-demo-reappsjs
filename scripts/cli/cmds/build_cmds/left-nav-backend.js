var props = require('../../../../reapps-properties.json'),
    leftNavBackend = require( '../../../left-nav-backend/left-nav-backend.js'),
    winston = require('winston');

exports.command = 'left-nav-backend'
exports.desc = 'Build left nav backend server.'
exports.builder = {}
exports.handler = function (argv) {
  winston.log('Building left-nav-backend!');
  leftNavBackend.build(props.paths.leftNavBackend);
}