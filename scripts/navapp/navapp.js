var utils = require('../utils/utils.js'),
    winston = require('winston'),
    fs = require('fs'),
    props = require('../../reapps-properties.json'),
    navAppConfigProperties = props.paths.navApp + (props.brand === 'BCOM' ? "BloomiesNavApp/BloomiesNavAppWeb/src/main/webapp/WEB-INF/classes/configuration/navapp-config.properties": "MacysNavApp/MacysNavAppWeb/src/main/webapp/WEB-INF/classes/configuration/navapp-config.properties");
    
winston.cli();    

function updatePom(paths, brand){
  console.log('test: ', paths, brand);
  var expectedSelectChannelConnector = "<connector implementation=\"org.mortbay.jetty.nio.SelectChannelConnector\"> \n <headerBufferSize>24000</headerBufferSize>",
      expectedSslSocketConnector = "<connector implementation=\"org.mortbay.jetty.security.SslSocketConnector\"> \n <headerBufferSize>24000</headerBufferSize>",
      expectedBloomiesUIAssetsLocation =  '<com.bloomies.webapp.BloomiesCommonUI.location>'+ paths.bloomiesCommonUi + 'src/main/webapp</com.bloomies.webapp.BloomiesCommonUI.location> \n \
                 <com.bloomies.webapp.BloomiesAssets.location>'+ paths.bloomiesAssets +'bloomies.war</com.bloomies.webapp.BloomiesAssets.location>',
      expectedMacysUIAssetsLocation =  '<com.macys.webapp.MacysCommonUI.location>'+ paths.macysCommonUi + 'src/main/webapp</com.macys.webapp.MacysCommonUI.location> \n \
                <com.macys.webapp.MacysAssets.location>'+ paths.macysAssets +'macys.war</com.macys.webapp.MacysAssets.location>',                 
      pathToProps = paths.navApp + (brand === "BCOM" ? "BloomiesNavApp/BloomiesNavAppWeb/pom.xml": "MacysNavApp/MacysNavAppWeb/pom.xml"),
      result;

    return new Promise(function( resolve, reject ){
      fs.readFile( pathToProps, 'utf8', function (err,data) {
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

        fs.writeFile( pathToProps, result, 'utf8', function (err) {
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
    return utils.updateAppProperty( navAppConfigProperties, [{"name": "SDP_HOST", "value": "http://" + sdpHost + ":85"}] );
  } else {
    return utils.getIp().then(function( response ){
      updateSdpHost( response );
    });
  }
}

module.exports = {
  update: {
    pom: updatePom,
    web: utils.updateWebXml,
    sdp: updateSdpHost
  }
};