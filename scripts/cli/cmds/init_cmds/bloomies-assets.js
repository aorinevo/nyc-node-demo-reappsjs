var props = require('../../../../reapps-properties.json'),
    bloomiesAssets = require('../../../bloomies-assets/bloomies-assets.js'),
    winston = require('winston');

exports.command = 'bloomies-assets'
exports.desc = 'Initializes BloomiesAssets'
exports.builder = {}
exports.handler = function (argv) {
  winston.log('Initializing BloomiesAssets!');
  bloomiesAssets.init();
}

