var winston = require('winston'),
    fs = require('fs'),
    shell = require('shelljs'),
    props = require('../../reapps-properties.json');
    
winston.cli();    

function updateServerApplication(pageName, port, pathToFile){

    return new Promise(function( resolve, reject ){
      fs.readFile( pathToFile, 'utf8', function (err,data) {
        if (err) {
          winston.log('error', err);
          reject( err );
        }
        var result = data;
        
        
        if( result.indexOf('process.env.PORT=') < 0 ){
          result = `process.env.PORT=${port}\n ${result}`;
        } else {
          result = result.replace(/process\.env\.PORT=.+/gm, `process.env.PORT=${port}`);
        }

        fs.writeFile( pathToFile, result, 'utf8', function (err) {
          if (err) {
            winston.log('error', err);
            reject( err );
          }
           winston.log('info', `Updated ${pageName} to use port ${port}`);
          resolve( result );
        });
      });
    });
}

module.exports = {
  init: updateServerApplication
  // build: buildPageApp,
  // run: runPageApp
};