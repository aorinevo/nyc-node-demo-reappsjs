var props = require('../../../reapps-properties.json'),
    fs = require('fs'),
    proxyServer = require('../proxy-server.js'),
    template = require('../../../templates/nginx/bcom-server-blocks.js'),
    winston = require( 'winston'),
    shell = require('shelljs'),
    secureMCrt = require('../../../templates/certificates/mobile-customer-app-ui.js')(),
    secureMKey = require('../../../templates/keys/mobile-customer-app-ui.js')(),
    snsNavAppCrt = require('../../../templates/certificates/sns-nav-apps.js')(),
    snsNavAppKey = require('../../../templates/keys/sns-nav-apps.js')(),
    pathToWrite = props.proxyServer.path + '/cert';

function updateServerBlocksFile( domainPrefix, envName, nginxRoot, force, ports ){
  return new Promise(function(resolve, reject){
    if( !fs.existsSync(`${nginxRoot}/servers/bcom-server-blocks.conf`) || force ){
      fs.writeFile( './bcom-server-blocks.conf', template( { domainPrefix: domainPrefix, envName: envName, nginxRoot: nginxRoot } ), 'utf8', function (err) {
        if (err) {
          winston.log(err);
          reject(false);
        }
        shell.exec(`sudo mv ./bcom-server-blocks.conf ${nginxRoot}/servers/bcom-server-blocks.conf`);
        winston.log( 'info', `created in ${nginxRoot}/servers/bcom-server-blocks.conf` );
        resolve(true);
      });
    } else {
      winston.log( 'info', `${nginxRoot}/servers/bcom-server-blocks.conf already exists. To replace this file, run with --force`);
      reject(false);
    }
  });
}


function initProxyServer( domainPrefix, envName, nginxRoot, force, ports ){
  var update = this.update;
  update.serverBlocks( domainPrefix, envName, nginxRoot, force, ports ).then(function(result){
    return update.certOrKey( secureMKey, pathToWrite, 'cert', 'key', 'nginx', force )
  }).then(function(result){
    return update.certOrKey( secureMCrt, pathToWrite, 'cert', 'crt', 'nginx', force );
  }).then(function(result){
    return update.certOrKey( snsNavAppKey, pathToWrite, 'server', 'key', 'nginx', force );
  }).then(function(result){
    return update.certOrKey( snsNavAppCrt, pathToWrite, 'server', 'crt', 'nginx', force );
  }).then(function(result){
    shell.exec('sudo nginx -s stop');
    shell.exec('sudo nginx');
    winston.log( 'info', `restarted nginx`);
  }).catch(function(result){
    winston.log('error', result);
  });
}

module.exports = {
  update: {
    serverBlocks: updateServerBlocksFile,
    certOrKey: proxyServer.updateCertOrKey
  },
  init: initProxyServer
};