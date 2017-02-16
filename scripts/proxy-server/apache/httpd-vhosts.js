var props = require('../reapps-properties.json'),
    fs = require('fs'),
    template = require('../templates/apache/bcom-httpd-vhosts.js'),
    winston = require( 'winston'),
    shell = require('shelljs'),
    argv = require('yargs').argv;

function updateHttpdVhostsFile( domainPrefix, envName ){
  if( !fs.existsSync('/etc/apache2/other/bcom-httpd-vhosts.conf') || argv.force ){
    fs.writeFile( './bcom-httpd-vhosts.conf', template( { domainPrefix: domainPrefix, envName: envName } ), 'utf8', function (err) {
       if (err) return console.log(err);
       shell.exec('sudo mv ./bcom-httpd-vhosts.conf /etc/apache2/other/bcom-httpd-vhosts.conf');
       winston.log( 'info', 'created in /etc/apache2/other/bcom-httpd-vhosts.conf' );       
       shell.exec( 'sudo apachectl restart');
       winston.log('info', 'restarted apache2');
    });
  } else {
    winston.log( 'info', '/etc/apache2/other/bcom-httpd-vhosts.conf already exists. To replace this file, run with --force');
  }
}

module.exports = {
  update: updateHttpdVhostsFile
};