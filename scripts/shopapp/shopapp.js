var utils = require('../utils/utils.js'),
    winston = require('winston'),
    fs = require('fs'),
    props = require('./reapps-properties.json'),
    shopAppConfigProperties = props.paths.shopApp + (props.brand === 'BCOM' ? "BCOM/BloomiesShopNServe/src/main/resources/META-INF/properties/common/environment.properties": "MCOM/MacysShopNServe/src/main/resources/META-INF/properties/common/environment.properties");
    
winston.cli(); 

function updatePomXml( paths ){
  var expectedBloomiesUIAssetsLocation =  '</com.macys.buildtools.maven.plugin.version>\n\
                <com.bloomies.webapp.BloomiesCommonUI.location>'+ paths.bloomiesCommonUi + 'src/main/webapp</com.bloomies.webapp.BloomiesCommonUI.location> \n \
                <com.bloomies.webapp.BloomiesAssets.location>'+ paths.bloomiesAssets +'bloomies.war</com.bloomies.webapp.BloomiesAssets.location>',
      pathToProps = paths.shopApp + "BCOM/BloomiesShopNServe/pom.xml",
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
    return utils.updateAppProperty( shopAppConfigProperties, [{"name": "SDP_HOST", "value": "http://" + SDP_HOST + ":85"}] );
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