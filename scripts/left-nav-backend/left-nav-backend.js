var winston = require('winston'),
    fs = require('fs'),
    shell = require('shelljs'),
    props = require('../../reapps-properties.json');
    
winston.cli(); 

function build(){
  var buildCommand = `cd ${props.paths.leftNavBackend} && npm install && npm update`;
  shell.exec( buildCommand );
}   

function run(){
  var runCommand = `cd ${props.paths.leftNavBackend} && npm run server`;
  shell.exec( runCommand );
}

module.exports = {
  run: run,
  build: build
};