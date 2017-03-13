var props = require('../../../../reapps-properties.json'),
    page = require( '../../../polaris/page.js'),
    apache = require('../../../proxy-server/apache/apache.js'),
    nginx = require('../../../proxy-server/nginx/nginx.js'),
    shell = require('shelljs'),
    winston = require('winston'),
    pathToServerApplicationFile = props.paths.creditGateway + '/lib/ServerApplication.js';

exports.command = 'customer-preferences'
exports.desc = `Initializes customer-preferences repo to run on port ${props.ports.customerPreferences}.`
exports.builder = {
  force: {
    alias: 'f',
    default: false
  }
}
exports.handler = function (argv) {
  page.init( 'customer-preferences', props.ports.customerPreferences, pathToServerApplicationFile ).then(function(result){
    if( props.proxyServer.name === 'apache24') {
      apache.update.httpdVhosts( props.domainPrefix, props.envName, props.proxyServer.path, argv.force, props.ports ).then(function(result){
        shell.exec('sudo apachectl restart');
        winston.log('info', 'Restarted apache!');
      });
    } else {
      nginx.update.serverBlocks( props.domainPrefix, props.envName, props.proxyServer.path, argv.force, props.ports );
    }
  });
  winston.log('warn', 'Make sure to run "re init httpd-vhosts" or "re init server-blocks" depending on your proxy server.');
}