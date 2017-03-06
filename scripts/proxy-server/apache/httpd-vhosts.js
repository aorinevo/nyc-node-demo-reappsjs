var fs = require('fs'),
    template = require('../../../templates/apache/bcom-httpd-vhosts.js'),
    winston = require( 'winston'),
    shell = require('shelljs');

function updateHttpdVhostsFile( domainPrefix, envName, apacheRoot, force ){
  if( !fs.existsSync(`${apacheRoot}/other/bcom-httpd-vhosts.conf`) || force ){
    fs.writeFile( './bcom-httpd-vhosts.conf', template( { domainPrefix: domainPrefix, envName: envName, apacheRoot: apacheRoot } ), 'utf8', function (err) {
       if (err) return console.log(err);
       shell.exec(`sudo mv ./bcom-httpd-vhosts.conf ${apacheRoot}/other/bcom-httpd-vhosts.conf`);
       winston.log( 'info', `created in ${apacheRoot}/other/bcom-httpd-vhosts.conf` );       
       shell.exec( 'sudo apachectl restart');
       winston.log('info', 'restarted apache2');
    });
  } else {
    winston.log( 'info', `${apacheRoot}/other/bcom-httpd-vhosts.conf already exists. To replace this file, run with --force`);
  }
}

module.exports = {
  update: updateHttpdVhostsFile
};