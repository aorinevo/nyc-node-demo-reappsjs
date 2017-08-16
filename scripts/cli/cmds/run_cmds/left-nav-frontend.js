var props = require('../../../../reapps-properties.json'),
    leftNavFrontend = require( '../../../left-nav-frontend/left-nav-frontend.js'),
    winston = require('winston');

exports.command = 'left-nav-frontend'
exports.desc = 'Run left nav frontend server.'
exports.builder = {}
exports.handler = function (argv) {
  winston.log('Running left-nav-frontend!');
  leftNavFrontend.run(props.paths.leftNavFrontend);
}