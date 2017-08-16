var props = require('../../../../reapps-properties.json'),
    leftNavBackend = require('../../../left-nav-backend/left-nav-backend.js'),
    winston = require('winston');

exports.command = 'left-nav-backend'
exports.desc = 'Initializes left-nav-backend'
exports.builder = {}
exports.handler = function (argv) {
  winston.log('Initializing left-nav-backend!');
  leftNavBackend.init( props.paths.leftNavBackend );
}

