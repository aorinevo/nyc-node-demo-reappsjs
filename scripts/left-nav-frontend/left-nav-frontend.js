var winston = require('winston'),
    fs = require('fs'),
    shell = require('shelljs'),
    props = require('../../reapps-properties.json');
    
winston.cli(); 

function build(){
  var buildCommand = `cd ${props.paths.leftNavFrontend} && npm install`;
  shell.exec( buildCommand );
}   

function run(){
  var runCommand = `cd ${props.paths.leftNavFrontend} && npm start`;
  shell.exec( runCommand );
}

module.exports = {
  run: run,
  build: build
};