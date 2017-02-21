var props = require('../../../reapps-properties.json'),
    fs = require('fs'),
    template = require('../../../templates/nginx/bcom-server-blocks.js'),
    winston = require( 'winston'),
    shell = require('shelljs'),
    argv = require('yargs').argv;

function updateServerBlocksFile( domainPrefix, envName ){
  if( !fs.existsSync('/usr/local/etc/servers/bcom-server-blocks.conf') || argv.force ){
    fs.writeFile( './bcom-server-blocks.conf', template( { domainPrefix: domainPrefix, envName: envName } ), 'utf8', function (err) {
      if (err) {
        return console.log(err);
      }
      shell.exec('sudo mv ./bcom-server-blocks.conf /usr/local/etc/nginx/servers/bcom-server-blocks.conf');
      winston.log( 'info', 'created in /usr/local/etc/nginx/servers/bcom-server-blocks.conf' );
      shell.exec( 'sudo nginx -s stop');
      shell.exec( 'sudo nginx');
      winston.log('info', 'restarted nginx');
    });
  } else {
    winston.log( 'info', '/usr/local/etc/servers/bcom-server-blocks.conf already exists. To replace this file, run with --force');
  }
}

module.exports = {
  update: updateServerBlocksFile
};