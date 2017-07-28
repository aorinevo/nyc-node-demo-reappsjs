var shell = require('shelljs'),
    props = require('../../../../reapps-properties.json');

exports.command = 'secure-m'
exports.desc = 'Run MobileCustomerAppUI (secure-m)'
exports.builder = {}
exports.handler = function (argv) {
  shell.exec( `cd ${props.paths.mobileCustomerAppUi} && grunt` );
}