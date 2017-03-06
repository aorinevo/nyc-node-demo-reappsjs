var utils = require('../utils/utils.js'),
    winston = require('winston'),
    fs = require('fs'),
    shell = require('shelljs'),
    props = require('../../reapps-properties.json'),
    shopAppConfigProperties = props.paths.shopApp + (props.brand === 'BCOM' ? "/BCOM/BloomiesShopNServe/src/main/resources/META-INF/properties/common/environment.properties": "/MCOM/MacysShopNServe/src/main/resources/META-INF/properties/common/environment.properties"),
    shopAppKillSwitchProperties = `${props.paths.tmp}/properties/local/${props.brand.toLowerCase()}/shopapp/killswitch.properties`;
    
winston.cli(); 

function updatePom( paths ){
  var expectedBloomiesUIAssetsLocation =  `</com.macys.buildtools.maven.plugin.version>
        <com.bloomies.webapp.BloomiesCommonUI.location>${paths.bloomiesCommonUi}/src/main/webapp</com.bloomies.webapp.BloomiesCommonUI.location>
        <com.bloomies.webapp.BloomiesAssets.location>${paths.bloomiesAssets}/bloomies.war</com.bloomies.webapp.BloomiesAssets.location>`,
      pathToProps = paths.shopApp + "/BCOM/BloomiesShopNServe/pom.xml",
      result;

    return new Promise(function( resolve, reject ){
      fs.readFile( pathToProps, 'utf8', function (err,data) {
        if (err) {
          winston.log('error', err);
          reject( err );
        }
        var result = data;

        if( result.indexOf( expectedBloomiesUIAssetsLocation ) == -1 ){
          result = result.replace("</com.macys.buildtools.maven.plugin.version>", expectedBloomiesUIAssetsLocation );
        }

        fs.writeFile( pathToProps, result, 'utf8', function (err) {
          if (err) {
            winston.log('error', err);
            reject( err );
          }
           winston.log('info', 'Updated ShopApp pom.xml.');
          resolve( result );
        });
      });
    });
}

function updateSdpHost( sdpHost ){
  if( sdpHost ){
    return utils.updateAppProperty( shopAppConfigProperties, [{"name": "SDP_HOST", "value": "http://" + sdpHost + ":85"}] ).then(function( result ){
      return sdpHost;
    });
  } else {
    return utils.getIp().then(function( response ){
      return updateSdpHost( response );
    });
  }
}

function updateProperties( properties ){
  return utils.updateAppProperty( shopAppConfigProperties, properties );
}

function updateKillSwitches( killSwitchList ){
  return utils.updateTmp( `${props.paths.tmp}/properties/local/${props.brand.toLowerCase()}/shopapp/killswitch.properties`, killSwitchList.split(","));
}

function initShopAppEnv(){
  this.update.pom( props.paths, props.brand );
  this.update.web( `${props.paths.shopApp}/BCOM/BloomiesShopNServe/src/main/webapp/WEB-INF/web.xml` );
  this.update.properties( props.shopAppProperties );
  this.update.sdp();
}

function buildShopApp(tests, enforcer){
  var buildCommand = `cd ${props.paths.shopApp}/BCOM && mvn clean install `;
  if( tests ){
    buildCommand += '-Dmaven.test.skip=true';
  }
  if( enforcer ){
    buildCommand += '-Denforcer.skip=true'
  }
  shell.exec(buildCommand);
}

function getKs(){
  fs.readFile( shopAppKillSwitchProperties, 'utf8', function (err,data) {
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
    ks: updateKillSwitches,
    properties: updateProperties    
  },
  init: initShopAppEnv,
  build: buildShopApp,
  get: {
    killSwitches: getKs
  }
};