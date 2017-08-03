var shell = require('shelljs'),
    macysUi = require('../../../macysui/macysui.js'),
    props = require('../../../../reapps-properties.json');

exports.command = 'macysui'
exports.desc = 'Run MacysUI grunt server'
exports.builder = {}
exports.handler = function (argv) {
  macysUi.run();
}