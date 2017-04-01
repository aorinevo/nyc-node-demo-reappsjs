var props = require('../../../../../reapps-properties.json'),
    entryPoint = require('../../../../polaris/entry-point.js'),
    winston = require('winston');
    
exports.command = 'entry-point [b]'
exports.desc = 'Creates entry point for brand [b]'
exports.builder = {
}
exports.handler = function (argv) {
  entryPoint.new( props.paths[argv.proj] );
}