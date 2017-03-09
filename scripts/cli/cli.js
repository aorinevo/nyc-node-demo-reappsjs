module.exports = require('yargs')
  .commandDir('../cli/cmds')
  .options({
  'force':{
    alias: 'f',
    describe: 'overwrite existing file'
  },
  'version':{
    alias: 'v',
    describe: 'ReappsJS package version'
  },
  'branch': {
    alias: 'b',
    describe: 'branch',
  },
  'envName': {
    alias: 'e',
    describe: 'environment name'
  },
  'brand': {
    alias: 'r',
    describe: 'brand',
    choices: ['MCOM', 'BCOM']
  },
  'save': {
    alias: 's',
    describe: 'save options'
  },
  'help': {
    alias: 'h',
    describe: 'help'
  }
}).help().argv;