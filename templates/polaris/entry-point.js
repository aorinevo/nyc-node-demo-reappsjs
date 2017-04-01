module.exports = function( data ){
  return `var App = require("pageApp"),
    Context = require("util/Context");

App.brand = "${data.brand}";
Context.add("credit-gateway", "js", require.context("credit-gateway/${data.brand}", true, /\.js$/));
Context.add("credit-gateway", "hbs", require.context("credit-gateway/${data.brand}", true, /\.hbs$/));
Context.add("credit-gateway", "scss", require.context("credit-gateway/${data.brand}", true, /\.scss$/));
App.start();`
}