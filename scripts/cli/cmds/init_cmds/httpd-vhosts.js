var props = require('../../../../reapps-properties.json'),
    apache = require('../../../proxy-server/apache/apache.js'),
    winston = require('winston');
exports.command = 'httpd-vhosts [f]';
exports.desc = `Creates or updates apache nyc-node-httpd-vhosts file. Use [f] to overwrite file.` ;
exports.builder = {
  force: {
    alias: 'f',
    default: false
  }
}
exports.handler = function (argv) {
  apache.update.httpdVhosts( props.domainPrefix, props.proxyServer.path, argv.force );
}