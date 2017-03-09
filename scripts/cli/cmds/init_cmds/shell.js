var props = require('../../../../reapps-properties.json'),
    shell = require( '../../../shell/shell.js'),
    winston = require('winston');

exports.command = 'shell'
exports.desc = 'Initializes shell file.'
exports.builder = {}
exports.handler = function (argv) {
  shell.init( props.paths.shellRc, props );
}