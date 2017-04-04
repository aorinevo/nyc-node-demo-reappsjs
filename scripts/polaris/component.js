var winston = require('winston'),
    fs = require('fs'),
    shell = require('shelljs'),
    props = require('../../reapps-properties.json');
    
winston.cli();

function getWriteDirectory( typeOfFile, pathToProj, brand, componentName){
  var  projName = pathToProj.split("/").slice(-1)[0];
  if( typeOfFile === 'test'){
    return `${pathToProj}/${typeOfFile}/${brand}/components/${componentName}`;
  } else {
    return `${pathToProj}/${typeOfFile}/${projName}/${brand}/components/${componentName}`;
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

function newHelper( pathToProj, templatePath, name, directory, fileName ){
  var template = require( templatePath ),
      writeDirectory,
      promisesArray = [];

  
  ['common','bcom','mcom'].forEach(function(item){
    writeDirectory = getWriteDirectory( directory, pathToProj, item, name );
    shell.mkdir('-p', writeDirectory);
    var promise = writeFile( `${writeDirectory}/${fileName}`, template( {componentName: name, brand: item}) );
    promisesArray.push(promise);
  });
  
  return Promise.all(promisesArray);
}

function deleteHelper( pathToProj, name, directory ){
  var  projName = pathToProj.split("/").slice(-1)[0];
  ['common','bcom','mcom'].forEach(function(item){
    shell.exec(`rm -rf ${pathToProj}/${directory}/${projName}/${item}/components/${name}`);
  });
}

function newView( pathToProj, name ){
  newHelper(pathToProj, '../../templates/polaris/view.js', name, 'src', `${name}View.js`).then(function(results){
    winston.log('info','Created views files in common, bcom, and mcom');
  }).catch(function(reason){
    winston.log('error', reason);
  });
}

function newScss( pathToProj, name ){
  newHelper(pathToProj, '../../templates/polaris/scss.js', name, 'scss', `${name}.scss`).then(function(results){
    winston.log('info','Created scss files in common, bcom, and mcom');
  }).catch(function(reason){
    winston.log('error', reason);
  });
}

function newHbs( pathToProj, name ){
  newHelper(pathToProj, '../../templates/polaris/hbs.js', name, 'views/templates', `${name}.hbs`).then(function(results){
    winston.log('info','Created hbs files in common, bcom, and mcom');
  }).catch(function(reason){
    winston.log('error', reason);
  });
}

function newSpec( pathToProj, name ){
  newHelper(pathToProj, '../../templates/polaris/spec.js', name, 'tests', `${name}.spec.js`).then(function(results){
    winston.log('info','Created spec files in common, bcom, and mcom');
  }).catch(function(reason){
    winston.log('error', reason);
  });
}

function deleteView( pathToProj, name ){
  deleteHelper( pathToProj, name, 'src' );
  winston.log('info', `Deleted ${name} views directory and files in common, bcom, and mcom`);
}

function deleteHbs( pathToProj, name ){
  deleteHelper( pathToProj, name, 'views/templates' );
  winston.log('info', `Deleted ${name} specs directory and files in common, bcom, and mcom`);
}

function deleteScss( pathToProj, name ){
  deleteHelper( pathToProj, name, 'scss' );
  winston.log('info', `Deleted ${name} scss directory and files in common, bcom, and mcom`);
}

function deleteSpec( pathToProj, name ){
  deleteHelper( pathToProj, name, 'tests' );
  winston.log('info', `Deleted ${name} specs directory and files in common, bcom, and mcom`);
}

module.exports = {
  new: {
    view: newView,
    hbs: newHbs,
    scss: newScss,
    spec: newSpec
  },
  delete: {
    view: deleteView,
    hbs: deleteHbs,
    scss: deleteScss,
    spec: deleteSpec
  }
};