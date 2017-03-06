var props = require('../../../../reapps-properties.json'),
    prettyjson = require('prettyjson'),
    winston = require('winston');

exports.command = 'reapps-props'
exports.desc = 'Logs reapps-properties.json file to the terminal.'
exports.builder = {}
exports.handler = function (argv) {
  winston.log('info', "\n" + prettyjson.render(props));
}