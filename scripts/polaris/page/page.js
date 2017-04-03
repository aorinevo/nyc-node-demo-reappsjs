var winston = require('winston'),
    fs = require('fs'),
    shell = require('shelljs'),
    props = require('../../../reapps-properties.json');
    
winston.cli();

function getWriteDirectory( typeOfFile, pathToProj, brand, componentName){
  var  projName = pathToProj.split("/").slice(-1)[0];
  if( typeOfFile === 'test'){
    return `${pathToProj}/${typeOfFile}/${brand}/pages/${componentName}`;
  } else {
    return `${pathToProj}/${typeOfFile}/${projName}/${brand}/pages/${componentName}`;
  }
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

function newView( pathToProj, pageName ){
  var template = require('../../../templates/polaris/pages/view.js'),
      writeDirectory,
      promisesArray = [];

  
  ['common','bcom','mcom'].forEach(function(item){
    writeDirectory = getWriteDirectory( 'src', pathToProj, item, pageName );
    shell.mkdir('-p', writeDirectory);
    var promise = writeFile( `${writeDirectory}/${pageName}View.js`, template( {componentName: pageName, brand: item}) );
    promisesArray.push(promise);
  });
  
  Promise.all(promisesArray).then(function(results){
    winston.log('info','Created views files in common, bcom, and mcom');
  }).catch(function(reason){
    console.log(reason);
  });
}

function newScss( pathToProj, pageName ){
  var template = require('../../../templates/polaris/pages/scss.js'),
      writeDirectory,
      promisesArray = [];

  
  ['common','bcom','mcom'].forEach(function(item){
    writeDirectory = getWriteDirectory( 'scss', pathToProj, item, pageName );
    shell.mkdir('-p', writeDirectory);
    var promise = writeFile( `${writeDirectory}/${pageName}.scss`, template( {componentName: pageName, brand: item}) );
    promisesArray.push(promise);
  });
  Promise.all(promisesArray).then(function(results){
    winston.log('info','Created scss files in common, bcom, and mcom');
  }).catch(function(reason){
    console.log(reason);
  });
}

function newHbs( pathToProj, pageName ){
  var template = require('../../../templates/polaris/pages/hbs.js'),
      writeDirectory,
      promisesArray = [];

  
  ['common','bcom','mcom'].forEach(function(item){
    writeDirectory = getWriteDirectory( 'views/templates', pathToProj, item, pageName );
    shell.mkdir('-p', writeDirectory);
    var promise = writeFile( `${writeDirectory}/${pageName}.hbs`, template( {componentName: pageName, brand: item}) );
    promisesArray.push(promise);
  });
  Promise.all(promisesArray).then(function(results){
    winston.log('info','Created hbs files in common, bcom, and mcom');
  }).catch(function(reason){
    console.log(reason);
  });
}

function newSpec( pathToProj, pageName ){
  var template = require('../../../templates/polaris/pages/spec.js'),
      projName = pathToProj.split("/").slice(-1)[0],
      writeDirectory,
      promisesArray = [];

  
  ['common','bcom','mcom'].forEach(function(item){
    writeDirectory = getWriteDirectory( 'tests', pathToProj, item, pageName );
    shell.mkdir('-p', writeDirectory);
    var promise = writeFile( `${writeDirectory}/${pageName}.spec.js`, template( {componentName: pageName, brand: item, projName: projName}) );
    promisesArray.push(promise);
  });
  Promise.all(promisesArray).then(function(results){
    winston.log('info','Created spec files in common, bcom, and mcom');
  }).catch(function(reason){
    console.log(reason);
  });
}

module.exports = {
  new: {
    view: newView,
    hbs: newHbs,
    scss: newScss,
    spec: newSpec
  }
};