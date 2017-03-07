var winston = require('winston'),
    props = require('../../../../reapps-properties.json'),
    m2 = require('../../../maven/m2.js'),
    apache = require('../../../proxy-server/apache/apache.js'),
    nginx = require('../../../proxy-server/nginx/nginx.js'),
    bloomiesAssets = require('../../../bloomies-assets/bloomies-assets.js'),
    navApp = require('../../../navapp/navapp.js'),
    shopApp = require('../../../shopapp/shopapp.js');

exports.command = 'box [f]'
exports.desc = 'Initializes proxy server, m2, navapp, shopapp, bloomies-assets, and macysui. Use [f] to overwrite file(s).'
exports.builder = {
  force: {
    alias: 'f',
    default: false
  }
}
exports.handler = function (argv) {
  m2.init( argv.force );
  bloomiesAssets.init();
  navApp.init();
  shopApp.init();
  switch( props.proxyServer.name ){        
    case 'apache24':
      apache.init( props.domainPrefix, props.envName, props.proxyServer.path, argv.force );
      break;
    case 'nginx':
      nginx.init( props.domainPrefix, props.envName, props.proxyServer.path, argv.force );
      break;
    default:
      winston.log('error', 'ReappsJS does not support this server.  Check proxyServer in reapps-properties.json.')
      break;
  }
}