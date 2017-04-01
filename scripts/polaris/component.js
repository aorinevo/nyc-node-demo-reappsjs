var winston = require('winston'),
    fs = require('fs'),
    shell = require('shelljs'),
    props = require('../../reapps-properties.json');
    
winston.cli();

function getWriteDirectory( typeOfFile, pathToProj, brand, componentName){
  var  projName = pathToProj.split("/").slice(-1)[0];
  return `${pathToProj}/${typeOfFile}/${projName}/${brand}/components/${componentName}`;
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

function newView( pathToProj, componentName ){
  var template = require('../../templates/polaris/view.js'),
      writeDirectory,
      promisesArray = [];

  
  ['common','bcom','mcom'].forEach(function(item){
    writeDirectory = getWriteDirectory( 'src', pathToProj, item, componentName );
    shell.mkdir('-p', writeDirectory);
    var promise = writeFile( `${writeDirectory}/${componentName}View.js`, template( {componentName: componentName, brand: item}) );
    promisesArray.push(promise);
  });
  
  Promise.all(promisesArray).then(function(results){
    winston.log('info','Created views files in common, bcom, and mcom');
  }).catch(function(reason){
    console.log(reason);
  });
}

function newScss( pathToProj, componentName ){
  var template = require('../../templates/polaris/scss.js'),
      writeDirectory,
      promisesArray = [];

  
  ['common','bcom','mcom'].forEach(function(item){
    writeDirectory = getWriteDirectory( 'scss', pathToProj, item, componentName );
    shell.mkdir('-p', writeDirectory);
    var promise = writeFile( `${writeDirectory}/${componentName}.scss`, template( {componentName: componentName, brand: item}) );
    promisesArray.push(promise);
  });
  Promise.all(promisesArray).then(function(results){
    winston.log('info','Created scss files in common, bcom, and mcom');
  }).catch(function(reason){
    console.log(reason);
  });
}

function newHbs( pathToProj, componentName ){
  var template = require('../../templates/polaris/hbs.js'),
      writeDirectory,
      promisesArray = [];

  
  ['common','bcom','mcom'].forEach(function(item){
    writeDirectory = getWriteDirectory( 'views/partials', pathToProj, item, componentName );
    shell.mkdir('-p', writeDirectory);
    var promise = writeFile( `${writeDirectory}/${componentName}.hbs`, template( {componentName: componentName, brand: item}) );
    promisesArray.push(promise);
  });
  Promise.all(promisesArray).then(function(results){
    winston.log('info','Created hbs files in common, bcom, and mcom');
  }).catch(function(reason){
    console.log(reason);
  });
}

module.exports = {
  new: {
    // component: newComponent,
    view: newView,
    hbs: newHbs,
    scss: newScss
    // spec: newSpec
  }
  // build: buildPageApp,
  // run: runPageApp
};