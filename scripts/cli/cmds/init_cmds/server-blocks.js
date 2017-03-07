var props = require('../../../../reapps-properties.json'),
    nginx = require('../../../proxy-server/nginx/nginx.js'),
    winston = require('winston');

exports.command = 'server-blocks [f]'
exports.desc = `Creates or updates nginx ${props.brand.toLowerCase()}-server-blocks file. Use [f] to overwrite file.`
exports.builder = {
  force: {
    alias: 'f',
    default: false
  }
}
exports.handler = function (argv) {
  nginx.update.serverBlocks( props.domainPrefix, props.envName, props.proxyServer.path, argv.force );
}