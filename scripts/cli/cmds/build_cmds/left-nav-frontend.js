var props = require('../../../../reapps-properties.json'),
    leftNavFrontend = require( '../../../left-nav-frontend/left-nav-frontend.js'),
    winston = require('winston');

exports.command = 'left-nav-frontend'
exports.desc = 'Build left nav frontend server.'
exports.builder = {}
exports.handler = function (argv) {
  winston.log('Building left-nav-frontend!');
  leftNavFrontend.build(props.paths.leftNavFrontend);
}