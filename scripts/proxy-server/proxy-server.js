var fs = require('fs'),
    winston = require( 'winston'),
    shell = require('shelljs'),
    argv = require('yargs').argv;

function updateCertOrKey( fileContent, pathToWrite, fileName, extension ){  
  if( !fs.existsSync( pathToWrite ) ){
    shell.exec(`sudo mkdir ${pathToWrite}` );
  }
  if( !fs.existsSync(`${pathToWrite}/${fileName}.${extension}`) || argv.force ){
    fs.writeFile( `./${fileName}.${extension}`, fileContent, 'utf8', function (err) {
      if (err) {
        winston.log('error', err);
        return false;
      }
      shell.exec(`sudo mv ./${fileName}.${extension} ${pathToWrite}/${fileName}.${extension}` );
      winston.log( 'info', `${fileName}.${extension} file created in ${pathToWrite}` );
      shell.exec('sudo apachectl restart');
      winston.log( 'info', `restarted apache`);
    });
  } else {
    winston.log( 'info', `${pathToWrite}/${fileName}.${extension} already exists.`);
    winston.log( 'info', `To overwrite file(s), use --force`);
  }
}

module.exports = {
  updateCertOrKey: updateCertOrKey
};