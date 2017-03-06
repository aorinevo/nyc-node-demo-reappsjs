var props = require('../../../../reapps-properties.json'),
    shopApp = require('../../../shopapp/shopapp.js'),
    winston = require('winston');

exports.command = 'shopapp'
exports.desc = 'Initializes ShopApp'
exports.builder = {}
exports.handler = function (argv) {
  winston.log('Initializing ShopApp!');
  shopApp.init( props.username, props.paths.shopApp );
}

