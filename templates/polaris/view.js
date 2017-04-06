module.exports = function( data ){
  if( data.brand === 'common' ){
    return `var $ = require('jquery'),
    Marionette = require('backbone.marionette'),
    pageApp = require('pageApp'),
    Context = require('util/Context');

var ${data.componentName}View = Marionette.ItemView.extend({
  el: "",
  initialize: function(options) {
      Context.load("credit-gateway", './components/${data.componentName}/${data.componentName}.scss');
      this.template = Context.load("credit-gateway-templates", './components/${data.componentName}/${data.componentName}.hbs');
  }
});

module.exports = ${data.componentName}View;`;
  } else {
    return `define([
  'jquery',
  'util/Context',
  './../../../common/components/${data.componentName}/${data.componentName}View'
],
function($, Context, ${data.componentName}View) {
  var View = ${data.componentName}View.extend({
    initialize: function(options) {
        ${data.componentName}View.prototype.initialize.call(this, options);
        console.log("initialize ${data.brand.toUpperCase()} ${data.componentName}View");
    }
  });

  return View;
});`
  }
};