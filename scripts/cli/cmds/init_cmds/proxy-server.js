var props = require('../../../../reapps-properties.json'),
    apache = require('../../../proxy-server/apache/apache.js'),
    nginx = require('../../../proxy-server/nginx/nginx.js'),
    winston = require('winston');

exports.command = 'proxy-server [f]'
exports.desc = 'Initializes proxy server.  Use [f] to overwrite file(s)'
exports.builder = {
  force: {
    alias: 'f',
    default: false
  }
}
exports.handler = function (argv) {
  winston.log('Initializing Proxy Server!');
  switch( props.proxyServer.name ){        
    case 'apache24':
      apache.init( props.domainPrefix, props.envName, props.proxyServer.path, argv.force, props.ports );
      break;
    case 'nginx':
      nginx.init( props.domainPrefix, props.envName, props.proxyServer.path, argv.force, props.ports );
      break;
    default:
      winston.log('error', 'ReappsJS does not support this server.  Check proxyServer in reapps-properties.json.')
      break;
  }
}

