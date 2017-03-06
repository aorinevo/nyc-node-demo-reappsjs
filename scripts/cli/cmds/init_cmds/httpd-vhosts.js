var props = require('../../../../reapps-properties.json'),
    httpdVhosts = require('../../../proxy-server/apache/httpd-vhosts.js'),
    winston = require('winston');

exports.command = 'httpd-vhosts';
exports.desc = `Creates or updates ${props.brand.toLowerCase()}-httpd-vhosts in ${props.proxyServer.path} directory`;
exports.builder = {};
exports.handler = function (argv) {
  httpdVhosts.update( props.domainPrefix, props.envName, props.proxyServer.path );
}