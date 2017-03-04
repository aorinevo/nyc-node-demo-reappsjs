#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
'use strict';
var jsonfile = require('jsonfile'),
    winston = require('winston'),
    prettyjson = require('prettyjson'),
    shell = require('shelljs'),
    utils = require('./scripts/utils/utils.js'),
    argv = require('./scripts/utils/cli-tools.js'),
    props = require('./reapps-properties.json'),
    navApp = require('./scripts/navapp/navapp.js'),
    shopApp = require('./scripts/shopapp/shopapp.js'),    
    SDP_HOST,
    responseBody,
    options = [];

winston.cli();

if( argv.brand ){
  options.push('brand: ' + argv.brand);
  props.brand = argv.brand;
}

if( argv.envName ){
  options.push('envName: ' + argv.envName);
  props.envName = argv.envName;
}

if( argv.branch ){
  options.push('branch: ' + argv.branch);
  props.branch = argv.branch;
}

if( argv.domainPrefix ){
  options.push('domainPrefix: ' + argv.domainPrefix);
  props.domainPrefix = argv.domainPrefix;
}

//Build apps
if( argv.mci || argv.mcist || argv.mcistd ){
  var app = argv.mci || argv.mcist || argv.mcistd,
      buildDirectories = {
        navApp: "BloomiesNavApp",
        shopApp: "BCOM",
        macysUi: "",
        bloomiesAssets: ""
      },
      buildCommand = `cd ${props.paths[app]}/${buildDirectories[app]} && mvn clean install `;
  if( argv.mcist ){
    buildCommand += '-Dmaven.test.skip=true';
  }
  if( argv.mcistd ){
    buildCommand += '-Dmaven.test.skip=true -Denforcer.skip=true'
  }
  shell.exec(buildCommand);
}

//Run apps
if( argv.mjr || argv.mjro ){
  var app = argv.mjr || argv.mjro,
      runDirectories = {
        navApp: "BloomiesNavApp/BloomiesNavAppWeb",
        shopApp: "BCOM/BloomiesShopNServe",
        bloomiesAssets: ""
      },
      runCommand = `cd ${props.paths[app]}/${runDirectories[app]} && mvn jetty:run `;
  if( argv.mjro ){
    runCommand += '-o';
  }
  shell.exec(runCommand);
}

//Get ReappsJS version
if( argv.version ){
  winston.log('info', 'ReappsJS version: ' + require('./package.json').version);
}

function actionHandler( action ){
  switch ( action ) {
    case 'runMacysUiServer':
      shell.exec( 'grunt' );
      break;
    case 'getNavAppKs':
      navApp.get.killSwitches();
      break;
    case 'getShopAppKs':
      shopApp.get.killSwitches();
      break;      
    case 'getReappsPropsJson':
      winston.log('info', "\n" + prettyjson.render(props, options));
      break;
    case 'getIp':
      return utils.getIp( SDP_HOST ).then(function( result ){
        SDP_HOST = result;
      }); 
      break;
    case 'listEnvs':
      return utils.listEnvs( responseBody ).then(function( result ){
        responseBody = result;
      });   
      break;
    case 'initM2':
      return require('./scripts/maven/m2.js').init();
      break;
    case 'updateNavAppSdpHost':
      return navApp.update.sdp( SDP_HOST ).then(function( response ){
        SDP_HOST = response;
        return SDP_HOST;
      });
      break;
    case 'updateShopAppSdpHost':
      return shopApp.update.sdp( SDP_HOST ).then(function( response ){
        SDP_HOST = response;
      });
      break;      
    case 'updateSdpHost':
      actionHandler( 'updateNavAppSdpHost');
      actionHandler( 'updateShopAppSdpHost');
      break;
    case 'updateNavAppPomXml':
      if( props.paths.navApp ){
        return navApp.update.pom( props.paths, props.brand );
      } else {
        winston.log('info', 'Trying to update NavApp pom.xml? Enter path to NavApp repo in reapps-properties.json.');
      }
      break;
    case 'updateShopAppPomXml':
      if( props.paths.shopApp ){
        return shopApp.update.pom( props.paths, props.brand );
      } else {
        winston.log('info', 'Trying to update ShopApp pom.xml? Enter path to ShopApp repo in reapps-properties.json.');
      }
      break;
    case 'updateNavAppTmp':
      if( props.paths.tmp && argv.killSwitchList ){
        utils.updateTmp( props.paths.tmp + '/properties/local/bcom/navapp/killswitch.properties', argv.killSwitchList.split(","));
      }
      break;
    case 'updateShopAppTmp':
      if( props.paths.tmp && argv.killSwitchList ){
        utils.updateTmp( props.paths.tmp + '/properties/local/bcom/shopapp/killswitch.properties', argv.killSwitchList.split(","));
      }
      break;      
    case 'updateNavAppWebXml':
      if( props.paths.navApp ){
        return navApp.update.web( props.paths.navApp + "/BloomiesNavApp/BloomiesNavAppWeb/src/main/webapp/WEB-INF/web.xml" );
      } else {
        winston.log('info', 'Trying to update NavApp web.xml? Enter path to NavApp repo in reapps-properties.json.');
      }
      break;
    case 'updateShopAppWebXml':
      if( props.paths.shopApp ){
        return navApp.update.web( props.paths.shopApp + "/BCOM/BloomiesShopNServe/src/main/webapp/WEB-INF/web.xml");
      } else {
        winston.log('info', 'Trying to update ShopApp web.xml? Enter path to ShopApp repo in reapps-properties.json.');
      }
      break;      
    case 'initNavAppEnv':
      return actionHandler( 'updateNavAppPomXml' ).then(function( result){
          return actionHandler( 'updateNavAppWebXml' );
        }).then( function( result ){
          return navApp.update.properties( props.navAppProperties );
        }).then( function( result ){
          return actionHandler( 'updateNavAppSdpHost' );
        });
      break;
    case 'initShopAppEnv':
      return actionHandler( 'updateShopAppPomXml' ).then(function( result){
        return actionHandler( 'updateShopAppWebXml' );
      }).then(function( result ){
        return shopApp.update.properties( props.shopAppProperties );
      }).then( function( result ){
        return actionHandler( 'updateShopAppSdpHost' );
      });
      break;
    case 'initBloomiesAssets':
      require( './scripts/bloomies-assets/bloomies-assets.js' ).update( props.username, props.paths.bloomiesAssets);
      break;
    case 'initEnvs': 
      return actionHandler( 'initNavAppEnv' ).then(function( response ){
        actionHandler( 'initShopAppEnv' );
        actionHandler( 'initBloomiesAssets' );
      });
      break;
    case 'initHttpdVhosts':
      require('./scripts/proxy-server/apache/httpd-vhosts.js').update( props.domainPrefix, props.envName, props.proxyServer.path );
      break;
    case 'initServerBlocks': //need to test
      require('./scripts/proxy-server/nginx/server-blocks.js').update( props.domainPrefix, props.envName, props.proxyServer.path );
      break;      
    case 'initBox':
      actionHandler( 'initEnvs' ).then(function( response ){
        actionHandler( 'initM2' );
        actionHandler( 'initShell' );
        actionHandler( 'initHosts' );
        actionHandler( 'initProxyServer' );
      });
      break;
    case 'initCertAndKey': //need to test for nginx
      var proxyServer = require('./scripts/proxy-server/proxy-server.js'),
      secureMCrt = require('./templates/certificates/mobile-customer-app-ui.js')(),
      secureMKey = require('./templates/keys/mobile-customer-app-ui.js')(),
      snsNavAppCrt = require('./templates/certificates/sns-nav-apps.js')(),
      snsNavAppKey = require('./templates/keys/sns-nav-apps.js')(),
      pathToWrite = props.proxyServer.path + '/cert';
      //MobileCustomerAppUI certificate and key (secure-m)
      proxyServer.updateCertOrKey( secureMCrt, pathToWrite, 'cert', 'crt' );
      proxyServer.updateCertOrKey( secureMKey, pathToWrite, 'cert', 'key' );
      //ShopNServe and NavApp certificate and key
      proxyServer.updateCertOrKey( snsNavAppCrt, pathToWrite, 'server', 'crt' );
      proxyServer.updateCertOrKey( snsNavAppKey, pathToWrite, 'server', 'key' );
      break;
    case 'initProxyServer':      
      switch( props.proxyServer.name ){        
        case 'apache24':
          //Need to use Promises
          actionHandler( 'initCertAndKey' );
          actionHandler( 'initHttpdVhosts' );
          break;
        case 'nginx':
          //Need to use Promises
          //need to test nginx
          actionHandler( 'initCertAndKey' );
          actionHandler( 'initServerBlocks' );
          break;
        default:
          winston.log('error', 'ReappsJS does not support this server.  Check proxyServer in reapps-properties.json.')
          break;
      }
      break;
    case 'initShell':
      //Need to use Promises
      require('./scripts/shell/shell.js').init( props.paths.shellRc, props );
      break;
    case 'initHosts':
      require( './scripts/hosts/hosts.js').update('/etc/hosts');
      break;
    case 'getGceIp':
      getGceIp();
      break;
  }
}

if( argv.save ){
  jsonfile.writeFile(props.paths['bloomies-ui-reapps'] + '/reapps-properties.json', props, {spaces: 2}, function (err) {    
    if( err ){
      winston.log('error', err.message);
    } else {
      winston.log('info', 'saved options to reapps-properties.json \n' + options);
      props = utils.parseProperties();
      actionHandler( argv.action );
    }
  });
} else {
  props = utils.parseProperties();
  actionHandler( argv.action );
}