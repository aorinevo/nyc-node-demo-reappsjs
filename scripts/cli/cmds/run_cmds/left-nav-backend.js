var props = require('../../../../reapps-properties.json'),
    leftNavBackend = require( '../../../left-nav-backend/left-nav-backend.js'),
    winston = require('winston');

exports.command = 'left-nav-backend'
exports.desc = 'Run left nav backend server.'
exports.builder = {}
exports.handler = function (argv) {
  winston.log('Running left-nav-backend!');
  leftNavBackend.run(props.paths.leftNavBackend);
}