var props = require('../../../../../reapps-properties.json'),
    component = require('../../../../polaris/page/page.js'),
    winston = require('winston');
    
exports.command = 'page [n] [s] [t] [v]'
exports.desc = 'Creates view [v], scss [s], spec [t], and hbs, with filename based on [n]. To skip a file type add the corresponding flag.'
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
  // if(!argv.v){
  //   component.new.view( props.paths[argv.proj], argv.n);
  // }
  // if(!argv.s){
  //   component.new.scss( props.paths[argv.proj], argv.n);
  // }
  if(!argv.b){
    component.new.hbs( props.paths[argv.proj], argv.n);
  }
  // if(!argv.t){
  //   component.new.spec( props.paths[argv.proj], argv.n);
  // }
}