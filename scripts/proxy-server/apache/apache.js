var fs = require('fs'),
    props = require('../../../reapps-properties.json'),
    template = require('../../../templates/apache/bcom-httpd-vhosts.js'),
    proxyServer = require('../proxy-server.js'),
    winston = require( 'winston'),
    shell = require('shelljs'),
    secureMCrt = require('../../../templates/certificates/mobile-customer-app-ui.js')(),
    secureMKey = require('../../../templates/keys/mobile-customer-app-ui.js')(),
    snsNavAppCrt = require('../../../templates/certificates/sns-nav-apps.js')(),
    snsNavAppKey = require('../../../templates/keys/sns-nav-apps.js')(),
    pathToWrite = props.proxyServer.path + '/cert';

function updateHttpdVhostsFile( domainPrefix, envName, apacheRoot, force, ports ){
  return new Promise(function(resolve, reject){
    if( !fs.existsSync(`${apacheRoot}/other/bcom-httpd-vhosts.conf`) || force ){
      fs.writeFile( './bcom-httpd-vhosts.conf', template( { domainPrefix: domainPrefix, envName: envName, apacheRoot: apacheRoot, ports: ports } ), 'utf8', function (err) {
         if (err){
          winston.log('error', err); 
          reject(err);
         }
         shell.exec(`sudo mv ./bcom-httpd-vhosts.conf ${apacheRoot}/other/bcom-httpd-vhosts.conf`);
         winston.log( 'info', `created in ${apacheRoot}/other/bcom-httpd-vhosts.conf` );
         resolve(true);
      });
    } else {
      winston.log( 'info', `${apacheRoot}/other/bcom-httpd-vhosts.conf already exists. To replace this file, run with --force`);
      reject(err);
    }
  });
}

function initProxyServer( domainPrefix, envName, apacheRoot, force ){
  var update = this.update;
  update.httpdVhosts( domainPrefix, envName, apacheRoot, force ).then(function(result){
    return update.certOrKey( secureMKey, pathToWrite, 'cert', 'key', 'apache24', force )
  }).then(function(result){
    return update.certOrKey( secureMCrt, pathToWrite, 'cert', 'crt', 'apache24', force );
  }).then(function(result){
    return update.certOrKey( snsNavAppKey, pathToWrite, 'server', 'key', 'apache24', force );
  }).then(function(result){
    return update.certOrKey( snsNavAppCrt, pathToWrite, 'server', 'crt', 'apache24', force );
  }).then(function(result){
    shell.exec('sudo apachectl restart');
    winston.log( 'info', `restarted apache`);
  }).catch(function(result){
    winston.log('error', result);
  });
}

module.exports = {
  update: {
    httpdVhosts: updateHttpdVhostsFile,
    certOrKey: proxyServer.updateCertOrKey
  },
  init: initProxyServer
};