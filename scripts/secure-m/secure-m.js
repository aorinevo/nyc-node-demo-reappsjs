var utils = require('../utils/utils.js'),
    winston = require('winston'),
    fs = require('fs'),
    shell = require('shelljs'),
    props = require('../../reapps-properties.json');
    
winston.cli();    

function updateIndex(path, envName){

    return new Promise(function( resolve, reject ){
      fs.readFile( path, 'utf8', function (err,data) {
        if (err) {
          winston.log('error', err);
          reject( err );
        }
        var result = data;

        result = result.replace(/\"oauth2_enabled\".+/g, "\"oauth2_enabled\" : \"off\"," );
        result = result.replace(/\"suggesterServiceURL\".+/g, "\"suggesterServiceURL\" : \"http://www."+ envName +".fds.com/suggester\"," );
        result = result.replace(/\"mewServerAddress\".+/g, "\"mewServerAddress\" : \"http://m."+ envName +".fds.com\"," );
        result = result.replace(/\"oauth2_host_name\".+/g, "\"oauth2_host_name\" : \"auth."+ envName +".fds.com\"," );
        result = result.replace(/\"mewMoreCatalogAddress\".+/g, "\"mewMoreCatalogAddress\" : \"https://macys.circularhub.com\"," );
        result = result.replace(/\"oauth2AuthorizationServerAddress\".+/g, "\"oauth2AuthorizationServerAddress\" : \"https://auth."+ envName +".fds.com\"," );
        

        fs.writeFile( path, result, 'utf8', function (err) {
          if (err) {
            winston.log('error', err);
            reject( err );
          }
           winston.log('info', 'Updated MobileCustomerAppUI index.html.');
          resolve( result );
        });
      });
    });
}

function initMobileCustomerAppUi(){
  this.update.index( `${props.paths.mobileCustomerAppUi}/client/bcom/src/index.html`, props.envName );
}

function runMobileCustomerAppUi(){
  console.log('test');
  var runCommand = `cd ${props.paths.mobileCustomerAppUi} && grunt`;
  shell.exec( runCommand );
}

module.exports = {
  update: {
    index: updateIndex
  },
  init: initMobileCustomerAppUi,
  run: runMobileCustomerAppUi
};