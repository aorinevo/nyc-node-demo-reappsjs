module.exports = function( data ){
  if( data.brand === 'common' ){
    return `var $ = require('jquery'),
    Marionette = require('backbone.marionette'),
    pageApp = require('pageApp'),
    Context = require('util/Context');

var ${data.componentName}View = Marionette.ItemView.extend({
  initialize: function(options) {
      this.template = Context.load("credit-gateway-templates", './pages/${data.componentName}/${data.componentName}.hbs');
  },
  onRender: function(){
    $("#container").append(this.$el);
  }
});

module.exports = ${data.componentName}View;`;
  } else {
    return `define([
  'jquery',
  'util/Context',
  './../../../common/pages/${data.componentName}/${data.componentName}View'
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