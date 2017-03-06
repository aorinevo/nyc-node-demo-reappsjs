var utils = require('../utils/utils.js'),
    winston = require('winston'),
    fs = require('fs'),
    shell = require('shelljs'),
    props = require('../../reapps-properties.json'),
    navAppConfigProperties = props.paths.navApp + (props.brand === 'BCOM' ? "/BloomiesNavApp/BloomiesNavAppWeb/src/main/webapp/WEB-INF/classes/configuration/navapp-config.properties": "/MacysNavApp/MacysNavAppWeb/src/main/webapp/WEB-INF/classes/configuration/navapp-config.properties"),
    navAppKillSwitchProperties = props.paths.tmp + `/properties/local/${props.brand.toLowerCase()}/navapp/killswitch.properties`;
    
winston.cli();    

function updatePom(paths, brand){
  var expectedSelectChannelConnector = "<connector implementation=\"org.mortbay.jetty.nio.SelectChannelConnector\"> \n <headerBufferSize>24000</headerBufferSize>",
      expectedSslSocketConnector = "<connector implementation=\"org.mortbay.jetty.security.SslSocketConnector\"> \n <headerBufferSize>24000</headerBufferSize>",
      expectedBloomiesUIAssetsLocation = `<com.bloomies.webapp.BloomiesCommonUI.location>${paths.bloomiesCommonUi}/src/main/webapp</com.bloomies.webapp.BloomiesCommonUI.location>
      <com.bloomies.webapp.BloomiesAssets.location>${paths.bloomiesAssets}/bloomies.war</com.bloomies.webapp.BloomiesAssets.location>`,
      expectedMacysUIAssetsLocation = `<com.macys.webapp.MacysCommonUI.location>${paths.macysCommonUi}/src/main/webapp</com.macys.webapp.MacysCommonUI.location>
      <com.macys.webapp.MacysAssets.location>${paths.macysAssets}/macys.war</com.macys.webapp.MacysAssets.location>`,                 
      pathToPom = paths.navApp + (brand === "BCOM" ? "/BloomiesNavApp/BloomiesNavAppWeb/pom.xml": "/MacysNavApp/MacysNavAppWeb/pom.xml"),
      result;

    return new Promise(function( resolve, reject ){
      fs.readFile( pathToPom, 'utf8', function (err,data) {
        if (err) {
          winston.log('error', err);
          reject( err );
        }
        var result = data;

        if( brand === "BCOM" ){
          if( result.indexOf( expectedBloomiesUIAssetsLocation ) == -1 ){
            result = result.replace("<com.bloomies.webapp.BloomiesCommonUI.location>${basedir}/target/commonui</com.bloomies.webapp.BloomiesCommonUI.location>", expectedBloomiesUIAssetsLocation );
          }
        } else {
          if( result.indexOf( expectedMacysUIAssetsLocation ) == -1 ){
            result = result.replace("<com.macys.webapp.MacysCommonUI.location>${basedir}/target/commonui</com.macys.webapp.MacysCommonUI.location>", expectedMacysUIAssetsLocation );
          }
        }

        if( result.indexOf( expectedSelectChannelConnector ) == -1 ){
          result = result.replace("<connector implementation=\"org.mortbay.jetty.nio.SelectChannelConnector\">", expectedSelectChannelConnector );
        }

        if( result.indexOf( expectedSslSocketConnector ) == -1 && brand === "BCOM"){
          result = result.replace("<connector implementation=\"org.mortbay.jetty.security.SslSocketConnector\">", expectedSslSocketConnector );
        }

        fs.writeFile( pathToPom, result, 'utf8', function (err) {
          if (err) {
            winston.log('error', err);
            reject( err );
          }
           winston.log('info', 'Updated NavApp pom.xml.');
          resolve( result );
        });
      });
    });
}

function updateSdpHost( sdpHost ){
  if( sdpHost ){
    return utils.updateAppProperty( navAppConfigProperties, [{"name": "SDP_HOST", "value": "http://" + sdpHost + ":85"}] ).then(function( result ){
      return sdpHost;
    });
  } else {
    return utils.getIp().then(function( response ){
      return updateSdpHost( response );
    });
  }
}

function updateProperties( properties ){
  return utils.updateAppProperty( navAppConfigProperties, properties );
}

function initNavAppEnv(){
  this.update.pom( props.paths );
  this.update.web();
  this.update.properties( props.navAppProperties );
  this.update.sdp();
}

function buildNavApp( tests, enforcer ){
  var buildCommand = `cd ${props.paths.navApp}/BloomiesNavApp && mvn clean install `;
  if( tests ){
    buildCommand += '-Dmaven.test.skip=true';
  }
  if( enforcer ){
    buildCommand += '-Denforcer.skip=true'
  }
  shell.exec(buildCommand);
}

function runNavApp( offline ){
  var runCommand = `cd ${props.paths.navApp}/BloomiesNavApp && mvn jetty:run `;
  if( offline ){
    runCommand += '-o';
  }
  shell.exec( runCommand );
}

function getKs(){
  fs.readFile( navAppKillSwitchProperties, 'utf8', function (err,data) {
    if (err) {
      winston.log('error', err);
    }
    var result = data;
    winston.log('info', "\n" + result);
  });
  return this;
}

module.exports = {
  update: {
    pom: updatePom,
    web: utils.updateWebXml,
    sdp: updateSdpHost,
    properties: updateProperties
  },
  init: initNavAppEnv,
  build: buildNavApp,
  run: runNavApp,
  get: {
    killSwitches: getKs
  }
};