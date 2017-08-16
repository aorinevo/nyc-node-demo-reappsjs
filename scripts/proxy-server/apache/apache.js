var fs = require('fs'),
    props = require('../../../reapps-properties.json'),
    template = require('../../../templates/apache/nyc-node-httpd-vhosts.js'),
    winston = require( 'winston'),
    shell = require('shelljs');

function updateHttpdVhostsFile( domainPrefix, apacheRoot, force ){
  return new Promise(function(resolve, reject){
    if( !fs.existsSync(`${apacheRoot}/other/nyc-node-vhosts.conf`) || force ){
      fs.writeFile( './nyc-node-httpd-vhosts.conf', template( { domainPrefix: domainPrefix } ), 'utf8', function (err) {
         if (err){
          winston.log('error', err); 
          reject(err);
         }
         shell.exec(`sudo mv ./nyc-node-httpd-vhosts.conf ${apacheRoot}/other/nyc-node-httpd-vhosts.conf`);
         winston.log( 'info', `created in ${apacheRoot}/other/nyc-node-httpd-vhosts.conf` );
         resolve(true);
      });
    } else {
      winston.log( 'info', `${apacheRoot}/other/nyc-node-httpd-vhosts.conf already exists. To replace this file, run with --force`);
      reject(err);
    }
  });
}

module.exports = {
  update: {
    httpdVhosts: updateHttpdVhostsFile
  }
};