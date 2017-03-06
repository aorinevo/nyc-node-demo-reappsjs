var props = require('../../../../reapps-properties.json'),
    navApp = require('../../../navApp/navapp.js'),
    winston = require('winston');

exports.command = 'navapp'
exports.desc = 'Initializes NavApp'
exports.builder = {}
exports.handler = function (argv) {
  winston.log('Initializing NavApp!');
  navApp.init( props.paths.navApp );
}

