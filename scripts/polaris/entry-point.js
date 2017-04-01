var winston = require('winston'),
    fs = require('fs'),
    shell = require('shelljs'),
    props = require('../../reapps-properties.json');
    
winston.cli();

function getWriteDirectory( pathToProj ){
  return `${pathToProj}/src`;
}

function writeFile( path, content ){
  return new Promise(function( resolve, reject ){
      fs.writeFile( path, content, 'utf8', function (err) {
        if (err) {
          winston.log('error', err);
          reject( err );
        }
        resolve( true );
      });
    });
}

function newEntryPoint( pathToProj, brand ){
  var template = require('../../templates/polaris/entry-point.js'),
      writeDirectory,
      promisesArray = [];

  
  ['bcom','mcom'].forEach(function(item){
    writeDirectory = getWriteDirectory( pathToProj );
    shell.mkdir('-p', writeDirectory);
    var promise = writeFile( `${writeDirectory}/app-${item}.js`, template( {brand: item}) );
    promisesArray.push(promise);
  });
  
  Promise.all(promisesArray).then(function(results){
    winston.log('info','Created entry points for bcom and mcom.');
  }).catch(function(reason){
    console.log(reason);
  });
}

module.exports = {
  new: newEntryPoint
};