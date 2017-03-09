#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
'use strict';
var jsonfile = require('jsonfile'),
    winston = require('winston'),
    prettyjson = require('prettyjson'),
    shell = require('shelljs'),
    utils = require('./scripts/utils/utils.js'),
    argv = require('./scripts/cli/cli.js'),
    props = require('./reapps-properties.json'),
    navApp = require('./scripts/navapp/navapp.js'),
    shopApp = require('./scripts/shopapp/shopapp.js'),    
    SDP_HOST,
    responseBody,
    options = [];

winston.cli();

if( argv.brand ){
  options.push('brand: ' + argv.brand);
  props.brand = argv.brand;
}

if( argv.envName ){
  options.push('envName: ' + argv.envName);
  props.envName = argv.envName;
}

if( argv.branch ){
  options.push('branch: ' + argv.branch);
  props.branch = argv.branch;
}

if( argv.domainPrefix ){
  options.push('domainPrefix: ' + argv.domainPrefix);
  props.domainPrefix = argv.domainPrefix;
}

if( argv.version ){
  winston.log('info', 'ReappsJS version: ' + require('./package.json').version);
}

if( argv.save ){
  jsonfile.writeFile(props.paths['bloomies-ui-reapps'] + '/reapps-properties.json', props, {spaces: 2}, function (err) {    
    if( err ){
      winston.log('error', err.message);
    } else {
      winston.log('info', 'saved options to reapps-properties.json \n' + options);
      props = utils.parseProperties();
      if( argv.action ){
        winston.log('error', 'ReappsJS no longer supports -a API.  See README.md for updated API.');
      }
    }
  });
} else {
  props = utils.parseProperties();
  if( argv.action ){
    winston.log('error', 'ReappsJS no longer supports -a API.  See README.md for updated API.');
  }
}