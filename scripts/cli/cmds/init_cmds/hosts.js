var props = require('../../../../reapps-properties.json'),
    hosts = require( '../../../hosts/hosts.js'),
    winston = require('winston');

exports.command = 'hosts'
exports.desc = 'Initializes hosts file.'
exports.builder = {}
exports.handler = function (argv) {
  hosts.init('/etc/hosts');
}