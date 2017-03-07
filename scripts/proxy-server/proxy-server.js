var fs = require('fs'),
    winston = require( 'winston'),
    shell = require('shelljs');

function updateCertOrKey( fileContent, pathToWrite, fileName, extension, proxyServerName, force ){
  return new Promise( function( resolve, reject ){
    if( !fs.existsSync( pathToWrite ) ){
      shell.exec(`sudo mkdir ${pathToWrite}` );
    }
    if( !fs.existsSync(`${pathToWrite}/${fileName}.${extension}`) || force ){
      fs.writeFile( `./${fileName}.${extension}`, fileContent, 'utf8', function (err) {
        if (err) {
          winston.log('error', err);
          reject(err);
        }
        shell.exec(`sudo mv ./${fileName}.${extension} ${pathToWrite}/${fileName}.${extension}` );
        winston.log( 'info', `${fileName}.${extension} file created in ${pathToWrite}` );
        resolve(true);
      });
    } else {
      winston.log( 'info', `${pathToWrite}/${fileName}.${extension} already exists.`);
      winston.log( 'info', `To overwrite file(s), use --force`);
      reject(false);     
    }
  });
}

module.exports = {
  updateCertOrKey: updateCertOrKey
};