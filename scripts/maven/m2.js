var fs = require('fs'),
    shell = require('shelljs'),
    props = require('../../reapps-properties.json'),
    winston = require('winston');
    
winston.cli();

function initM2( force ){
  if( !fs.existsSync(process.env.HOME + '/.m2/settings.xml') || force ){
    shell.mkdir(process.env.HOME + '/.m2');
    shell.cp( props.paths['bloomies-ui-reapps'] + '/templates/maven/settings.xml', process.env.HOME + '/.m2');
    winston.log( 'info', 'created settings.xml file in ~/.m2');
  } else {
    winston.log( 'info', '~/.m2 directory already exists.');
  }
}

module.exports = {
  init: initM2
}