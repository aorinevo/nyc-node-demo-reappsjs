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
      
      var missingQaEnvs1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14].filter(function(value){
        return data.indexOf("local.secure-m.qa" + value ) == -1;
      });
      
      var missingQaEnvs2 = ["","www.","www1.", "credit-gateway.", "credit-drop-down."].filter(function(value){
        return data.indexOf( value + props.domainPrefix + ".bloomingdales.fds.com") == -1;
      });      
      
      missingQaEnvs1.forEach( function( value ){
        newEntries += "127.0.0.1        local.secure-m.qa" + value + "codebloomingdales.fds.com\n";
      });
      
      missingQaEnvs2.forEach( function( value ){
        newEntries += "127.0.0.1        " + value + props.domainPrefix + ".bloomingdales.fds.com\n";
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
         if( props.proxyServer.name === 'apache24'){
           shell.exec( 'sudo apachectl restart');
           winston.log('info', 'restarted apache2');
         } else {
           if( fs.existsSync( '/usr/local/var/run/nginx.pid' ) ){
             shell.exec( 'sudo nginx -s stop');
           }
           shell.exec( 'sudo nginx');
           winston.log('info', 'restarted nginx');
           resolve(true);
         }
      });
    });
  });
}

module.exports = {
  update: updateHostsFile,
  init: updateHostsFile
};

