var props = require('../../../../reapps-properties.json'),
    leftNavFrontend = require('../../../left-nav-frontend/left-nav-frontend.js'),
    winston = require('winston');

exports.command = 'left-nav-frontend'
exports.desc = 'Initializes left-nav-frontend'
exports.builder = {}
exports.handler = function (argv) {
  winston.log('Initializing left-nav-frontend!');
  leftNavFrontend.init( props.paths.leftNavBackend );
}

