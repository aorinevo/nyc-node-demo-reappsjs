module.exports = function( data ){
  if( data.brand === 'common' ){
    return `var $ = require('jquery'),
    Marionette = require('backbone.marionette'),
    pageApp = require('pageApp'),
    Context = require('util/Context');

var ${data.componentName}View = Marionette.ItemView.extend({
//Add cool stuff here!
});

module.exports = ${data.componentName}View;`;
  } else {
    return `define([
  'jquery',
  'util/Context',
  './../../../common/components/${data.componentName}/${data.componentName}View'
],
function($, Context, ${data.componentName}View) {
  var ${data.componentName}View = ${data.componentName}View.extend({
    initialize: function(options) {
        ${data.componentName}View.prototype.initialize.call(this, options);
        console.log("initialize ${data.brand.toUpperCase()} ${data.componentName}View");
    }
  });

  return ${data.componentName}View;
});`
  }
};