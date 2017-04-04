var props = require('../../../../../reapps-properties.json'),
    component = require('../../../../polaris/component.js'),
    winston = require('winston');
    
exports.command = 'component [n] [s] [t] [v]'
exports.desc = 'Deletes view [v], scss [s], spec [t], and hbs, with filename based on [n]. To skip a file type add the corresponding flag.'
exports.builder = {
  'name': {
    demandOption: true,
    alias: 'n'
  },
  'view': {
    default: false,
    alias: 'v'
  },
  'stylesheet': {
    default: false,
    alias: 's'
  },
  'spec': {
    default: false,
    alias: 't'
  },
  'templates': {
    default: false,
    alias: 'b'
  }
}
exports.handler = function (argv) {
  if(!argv.v){
    component.delete.view( props.paths[argv.proj], argv.n);
  }
  if(!argv.s){
    component.delete.scss( props.paths[argv.proj], argv.n);
  }
  if(!argv.b){
    component.delete.hbs( props.paths[argv.proj], argv.n);
  }
  if(!argv.t){
    component.delete.spec( props.paths[argv.proj], argv.n);
  }
}