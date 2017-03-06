var winston = require('winston'),
    shell = require('shelljs'),
    props = require('../../reapps-properties.json');
    
winston.cli();    
console.log('macysui');
function buildMacysUi( tests, enforcer ){
  var buildCommand = `cd ${props.paths.macysUi} && mvn clean install `;
  if( tests ){
    buildCommand += '-Dmaven.test.skip=true';
  }
  if( enforcer ){
    buildCommand += '-Denforcer.skip=true';
  }
  shell.exec(buildCommand);
}

function runMacysUi( ){
  var runCommand = `cd ${props.paths["bloomies-ui-reapps"]} && grunt`;
  shell.exec( runCommand );
}

module.exports = {
  build: buildMacysUi,
  run: runMacysUi
};