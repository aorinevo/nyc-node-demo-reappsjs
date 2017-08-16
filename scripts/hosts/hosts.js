var props = require('../../reapps-properties.json'),
    fs = require('fs'),
    winston = require( 'winston'),
    shell = require('shelljs');
    
winston.cli();

var newEntries = "";

function updateHostsFile( pathToHostsFile ){
  return new Promise(function(resolve, reject){
    fs.readFile( pathToHostsFile, 'utf8', function (err,data) {
      if (err) {
        winston.log('error', err);
        reject( err );
      }
      
      var result;
      
      var missingDNS = ["left-nav-backend", "left-nav-frontend"].filter(function(value){
        return data.indexOf(`${value}.nyc-node.com` ) == -1;
      });     
      
      missingDNS.forEach( function( value ){
        newEntries += `127.0.0.1        ${value}.nyc-node.com\n`;
      });
      
      if( newEntries ){
        result = data.replace(/(^::1.+)/gm, "$1\n" + newEntries );
      } else {
        result = data;
      }

      fs.writeFile( './hosts', result, 'utf8', function (err) {
         if (err){
           winston.log('error', err);
           reject( err );
         }
         shell.exec( 'sudo cp ./hosts /etc');         
         winston.log('info', 'Updated ' + pathToHostsFile);
         shell.exec( 'sudo apachectl restart');
         winston.log('info', 'restarted apache2');
      });
    });
  });
}

module.exports = {
  update: updateHostsFile,
  init: updateHostsFile
};

