var props = require('../../../../reapps-properties.json'),
    serverBlocks = require('../../../proxy-server/nginx/server-blocks.js'),
    winston = require('winston');

exports.command = 'server-blocks'
exports.desc = `Creates or updates ${props.brand.toLowerCase()}-server-blocks in ${props.proxyServer.path} directory`
exports.builder = {}
exports.handler = function (argv) {
  serverBlocks.update( props.domainPrefix, props.envName, props.proxyServer.path );
}