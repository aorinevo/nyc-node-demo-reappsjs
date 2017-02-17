var fs = require('fs'),
    winston = require( 'winston'),
    shell = require('shelljs'),
    props = require('../../reapps-properties.json'),
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

function updateServerBlocks( proxyServer, fileName, extension ){
  var pathToServerBlocksFile = `${proxyServer.path}/servers/${fileName}.${extension}`;
  if( !fs.existsSync( `${proxyServer.path}/servers` ) ){
    shell.exec(`sudo mkdir ${proxyServer.path}/servers` );
  }
  if( !fs.existsSync(pathToServerBlocksFile) || argv.force ){
    fs.writeFile( `./${fileName}.${extension}`, serverBlocks[proxyServer.name][fileName], 'utf8', function (err) {
        if (err) {
         winston.log('error', err);
         return false;
        }
        shell.exec(`sudo mv ./${fileName}.${extension} ${pathToServerBlocksFile}` );
       winston.log( 'info', `created ${pathToServerBlocksFile}` );
       if( proxyServer.name === 'apache24' ){
        shell.exec('sudo apachectl restart');
       } else {
        shell.exec('sudo nginx -s stop');
        shell.exec('sudo nginx');
       }
       
       winston.log( 'info', `restarted ${proxyServer.name}`);
    });
  } else {
    winston.log( 'info', `${pathToServerBlocksFile} already exists.`);
    winston.log( 'info', `To overwrite file(s), use --force`);
  }
}

module.exports = {
  updateCertOrKey: updateCertOrKey,
  updateServerBlocks: updateServerBlocks,
  updateVirtualHosts: updateServerBlocks
};