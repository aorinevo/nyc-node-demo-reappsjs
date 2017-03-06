var shell = require('shelljs'),
    props = require('../../../../reapps-properties.json');

exports.command = 'macysui'
exports.desc = 'Run MacysUI grunt server'
exports.builder = {}
exports.handler = function (argv) {
  shell.exec( `cd ${props.paths["bloomies-ui-reapps"]} && grunt` );
}