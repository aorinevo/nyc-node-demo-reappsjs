var request = require('request'),
    Table = require('cli-table'),
    jsonfile = require('jsonfile'),
    winston = require('winston'),
    SSH = require('simple-ssh'),
    prompt = require('prompt'),
    proxyServer = require('./proxy-server'),
    hosts = require( './hosts.js'),
    bloomiesAssets = require( './bloomies-assets.js' ),
    shell = require('shelljs'),
    proxy = require('./proxy.js'),
    httpdSsl = require('./httpd-ssl.js'),
    cliSpinners = require('cli-spinners'),
    ora = require('ora'),
    fs = require('fs'),
    argv = require('yargs').argv,
    props = require('./reapps-properties.json'),
    spinner = ora(cliSpinners.dots),
    requestOptions,
    navAppConfigProperties = props.paths.navApp + "BloomiesNavApp/BloomiesNavAppWeb/src/main/webapp/WEB-INF/classes/configuration/navapp-config.properties",
    shopAppConfigProperties = props.paths.shopApp + "BCOM/BloomiesShopNServe/src/main/resources/META-INF/properties/common/environment.properties",
    navAppPom,
    shopAppPom,
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

requestOptions = {
  method: 'post',
  body: {
    "release": props.branch,
    "stream": props.brand
  },
  json: true,
  url: 'http://mdc2vr4073:9099/RAPADDashboardConfig/getEnvDetails.html'
}

function startAjaxCall( options ){
  spinner.text = 'Connecting to Reapps...';
  spinner.start();
  return new Promise(function(resolve, reject){
    request( options, function(err, res, body){
      spinner.stop();
      if(err){
        reject( new Error( 'Connection to Reapps failed!  Check that you are connected to the internet and on the VPN') );
      } else {
        resolve( body );
      }
    });
  });
}

function listEnvs( body ){
  winston.log('info', 'List of Environments for '+ props.branch+' '+props.brand);
  
  var table = new Table({
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
           , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
           , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
           , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
  });
   
  table.push(
      ['Site', 'backDoorUrl', 'Type', 'State', 'Completion Date']
  );
  
  body.envDetails.forEach(function(element){
    var jenkinsEnvMgmtBOs = element.jenkinsEnvMgmtBOs[0];
    table.push( 
      [element.envName, jenkinsEnvMgmtBOs.backDoorUrl, jenkinsEnvMgmtBOs.envType, jenkinsEnvMgmtBOs.envStatus, jenkinsEnvMgmtBOs.completedTime]
    );
  });
   
  winston.log('info', "\n" + table.toString());

  return table;
}

function getIp( body ){
  var environment = body.envDetails.filter(function( element ){
    return element.envName == props.envName;
  });

  if( environment.length == 0 ){
    winston.log('error', 'Environment name '+ props.envName + ' is not in the list of '+ props.branch +' environments.');
    return false;
  } else {
    var ip = environment[0].jenkinsEnvMgmtBOs[0].environmentDetails.f5vip;
    winston.log('info', 'SDP_HOST='+ip);
    return ip;
  }
}

function getGceIp(){
  prompt.start();
  prompt.get([{
    name: 'password',
    required: true,
    hidden: true
   }], function (err, result) {
    var ssh = new SSH({
      host: 'sns.'+props.envName+'.c4d.devops.fds.com',
      user: props.username,
      pass: result.password
    }).exec("cat /usr/jboss/jbosseap/sns_master/configuration/environment.properties | grep '^SDP_HOST='", {
        err: function(stderr) {
          winston.log('error', 'Could not ssh into GCE ' + props.envName + '. Is this a GCE? Is the GCE available?');
        },
        out: function(stdout) {
          winston.log('info', 'GCE '+ props.envName + ': ' + stdout.trim());
        }
    }).exec('exit').start();
  });
}

function initShell(){
  fs.readFile( props.paths.shellRc, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result,
        newLines = "";
    
    result = data.replace(/^export JAVA_HOME=.+/gm, 'export JAVA_HOME='+ props.libPaths.javaHome)
                 .replace(/^export MAVEN_HOME=.+/gm, 'export MAVEN_HOME='+ props.libPaths.mavenHome)
                 .replace(/^export MAVEN_OPTS=.+/gm, 'export MAVEN_OPTS='+ props.libPaths.mavenOpts);

    if( data.indexOf("JAVA_HOME")== -1){
     newLines = newLines + 'export JAVA_HOME='+ props.libPaths.javaHome + '\n';
    }
    
    if( data.indexOf("MAVEN_HOME")== -1){
     newLines = newLines + 'export MAVEN_HOME='+ props.libPaths.mavenHome + '\n';
    }   
    
    if( data.indexOf("MAVEN_OPTS")== -1){
     newLines = newLines + 'export MAVEN_OPTS='+ props.libPaths.mavenOpts + '\n';
    }        
  
    if( data.indexOf("export M2_OPTS=$MAVEN_OPTS")== -1){
      newLines = newLines + "export M2_OPTS=$MAVEN_OPTS\n";
    }
    
    if( data.indexOf("export PATH=$MAVEN_HOME/bin:$JAVA_HOME/bin:$PATH")== -1){
      newLines = newLines + "export PATH=$MAVEN_HOME/bin:$JAVA_HOME/bin:$PATH\n";
    }
    
    if( data.indexOf("alias reapps=")== -1){
      newLines = newLines + 'alias reapps="node '+ props.paths["bloomies-ui-reapps"] +'reapps.js "';
    }

    if( newLines || data != result ){
      if( newLines ){
        result = newLines + "\n" + result;
      }
      fs.writeFile( props.paths.shellRc, result, 'utf8', function (err) {
         if (err) return console.log(err);
         console.log('source ' + props.paths.shellRc);
         shell.exec('source ' + props.paths.shellRc);
      });
    }
  });
}

function updateSdpHost( sdpHost, pathToProps ){
  return new Promise(function(resolve, reject){
    fs.readFile( pathToProps, 'utf8', function (err,data) {
      if (err) {
        winston.log('error', err);
        reject( err );
      }
      var result = data.replace(/^SDP_HOST=http:\/\/.+/gm, 'SDP_HOST=http://'+ sdpHost + ':85');

      fs.writeFile(pathToProps, result, 'utf8', function (err) {
         if (err){
           winston.log('error', err);
           reject( err );
         }
         winston.log('info', 'Updated SDP_HOST in \n' + pathToProps);
         resolve( sdpHost );
      });
    });
  });
}

function setNavAppDomainPrefix( pathToProps ){
  return new Promise(function(resolve, reject){
      fs.readFile( pathToProps, 'utf8', function (err,data) {
        if (err) {
          winston.log('error', err);
          reject( err );
        }
        var result = data.replace(/^ASSETS_HOST.+/gm, 'ASSETS_HOST=http://'+ props.domainPrefix + '.bloomingdales.fds.com')
                         .replace(/^COMMON_ASSETS_HOST.+/gm , 'COMMON_ASSETS_HOST=http://'+ props.domainPrefix + '.bloomingdales.fds.com')
                         .replace(/^ASSETS_SECURE_HOST.+/gm, 'ASSETS_SECURE_HOST=https://'+ props.domainPrefix + '.bloomingdales.fds.com')
                         .replace(/^HOST.+/gm, 'HOST=http://'+ props.domainPrefix + '.bloomingdales.fds.com')
                         .replace(/^SECURE_HOST.+/gm, 'SECURE_HOST=https://'+ props.domainPrefix + '.bloomingdales.fds.com');

        fs.writeFile( pathToProps, result, 'utf8', function (err) {
           if (err){
            winston.log('error', err);
            reject( err );
           }
           winston.log('info', 'Set domain prefix on ASSETS_HOST, COMMON_ASSETS_HOST, ASSETS_SECURE_HOST, HOST, and SECURE_HOST in NavApp\n ' + pathToProps);
           resolve( result );
        });
      });
  });
}

function setShopAppDomainPrefix( pathToProps ){
  return new Promise(function(resolve, reject){
      fs.readFile( pathToProps, 'utf8', function (err,data) {
        if (err) {
          winston.log('error', err);
          reject( err );
        }
        var result = data.replace(/^ASSETS_HOST.+/gm, 'ASSETS_HOST=http://'+ props.domainPrefix + '.bloomingdales.fds.com')
                         .replace(/^HOST.+/gm, 'HOST=http://'+ props.domainPrefix + '.bloomingdales.fds.com')
                         .replace(/^SECURE_HOST.+/gm, 'SECURE_HOST=https://'+ props.domainPrefix + '.bloomingdales.fds.com');

        fs.writeFile( pathToProps, result, 'utf8', function (err) {
           if (err){
            winston.log('error', err);
            reject( err );
           }
           winston.log('info', 'Set domain prefix on ASSETS_HOST, HOST, and SECURE_HOST in ShopApp\n ' + pathToProps);
           resolve( result );
        });
      });
  });
}

function updateAppProperty( pathToProps, propertiesList ){
  return new Promise(function(resolve, reject){
      fs.readFile( pathToProps, 'utf8', function (err,data) {
        if (err) {
          winston.log('error', err);
          reject( err );
        }
        var result = data,
            message = "";
         propertiesList.forEach(function( property ){
           result = result.replace(new RegExp('^'+ property.name +'.+', "gm"), property.name + "=" + property.value);
           message += 'Updated ' + property.name + ' to '+ property.value + ' in\n ' + pathToProps + '\n';
         });
        fs.writeFile( pathToProps, result, 'utf8', function (err) {
           if (err){
            winston.log('error', err);
            reject( err );
           }
           winston.log('info', message);
           resolve( result );
        });
      });
  });
}

function updateTmp( pathToFile, killSwitchList ){
  return new Promise(function(resolve, reject){
      fs.readFile( pathToFile, 'utf8', function (err,data) {
        if (err) {
          winston.log('error', err);
          reject( err );
        }
        var result = data,
            message = "";
         killSwitchList.forEach(function( killSwitch ){
           if( result.search( new RegExp('^'+ killSwitch +'=.+', "gm") ) < 0){
             result += '\n' + killSwitch + '=true';
           }
         });
        fs.writeFile( pathToFile, result, 'utf8', function (err) {
           if (err){
            winston.log('error', err);
            reject( err );
           }
           winston.log('info', 'updates killswitch.properties file in ' + pathToFile);
           resolve( result );
        });
      });
  });
}

function updateNavAppPomXml(){
  var expectedSelectChannelConnector = "<connector implementation=\"org.mortbay.jetty.nio.SelectChannelConnector\"> \n <headerBufferSize>24000</headerBufferSize>",
      expectedSslSocketConnector = "<connector implementation=\"org.mortbay.jetty.security.SslSocketConnector\"> \n <headerBufferSize>24000</headerBufferSize>",
      expectedBloomiesUIAssetsLocation =  '<com.bloomies.webapp.BloomiesCommonUI.location>'+ props.paths.bloomiesCommonUi + 'src/main/webapp</com.bloomies.webapp.BloomiesCommonUI.location> \n \
                 <com.bloomies.webapp.BloomiesAssets.location>'+ props.paths.bloomiesAssets +'bloomies.war</com.bloomies.webapp.BloomiesAssets.location>',
      pathToProps = props.paths.navApp + "BloomiesNavApp/BloomiesNavAppWeb/pom.xml",
      result;

    return new Promise(function( resolve, reject ){
      fs.readFile( pathToProps, 'utf8', function (err,data) {
        if (err) {
          winston.log('error', err);
          reject( err );
        }
        var result = data;

        if( result.indexOf( expectedBloomiesUIAssetsLocation ) == -1 ){
          result = result.replace("<com.bloomies.webapp.BloomiesCommonUI.location>${basedir}/target/commonui</com.bloomies.webapp.BloomiesCommonUI.location>", expectedBloomiesUIAssetsLocation );
        }

        if( result.indexOf( expectedSelectChannelConnector ) == -1 ){
          result = result.replace("<connector implementation=\"org.mortbay.jetty.nio.SelectChannelConnector\">", expectedSelectChannelConnector );
        }

        if( result.indexOf( expectedSslSocketConnector ) == -1 ){
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

function updateWebXml( pathToWebXml ){
  var expectedDefaultServlet = "<!-- DO NOT COMMIT -->\n\
          <servlet>\n\
              <servlet-name>default</servlet-name>\n\
              <servlet-class>org.mortbay.jetty.servlet.DefaultServlet</servlet-class>\n\
              <init-param>\n\
                  <param-name>useFileMappedBuffer</param-name>\n\
                  <param-value>false</param-value>\n\
              </init-param>\n\
              <load-on-startup>0</load-on-startup>\n\
          </servlet>";

  return new Promise(function( resolve, reject ){
    var result;
    fs.readFile( pathToWebXml, 'utf8', function (err,data) {
      if (err) {
        winston.log('error', err);
        reject( err );
      }
      result = data;

      if( result.indexOf( expectedDefaultServlet ) == -1 ){
        result = result.replace("</web-app>", expectedDefaultServlet + "\n </web-app>");
      }

      fs.writeFile( pathToWebXml, result, 'utf8', function (err) {
        if (err) {
          winston.log('error', err);
          reject( err );
        }
         winston.log('info', 'Updated web.xml. in \n' + pathToWebXml);
        resolve( result );
      });
    });
  });
}

function updateShopAppPomXml(){
  var expectedBloomiesUIAssetsLocation =  '</com.macys.buildtools.maven.plugin.version>\n\
                <com.bloomies.webapp.BloomiesCommonUI.location>'+ props.paths.bloomiesCommonUi + 'src/main/webapp</com.bloomies.webapp.BloomiesCommonUI.location> \n \
                <com.bloomies.webapp.BloomiesAssets.location>'+ props.paths.bloomiesAssets +'bloomies.war</com.bloomies.webapp.BloomiesAssets.location>',
      pathToProps = props.paths.shopApp + "BCOM/BloomiesShopNServe/pom.xml",
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

function actionHandler( action ){
  switch ( action ) {
    case 'getIp':
      if( SDP_HOST ){
        return SDP_HOST;
      } else {
        return startAjaxCall( requestOptions ).catch(function( reason ){
          winston.log( 'error', reason.message );
        }).then( function( body ){
          responseBody = body,
          SDP_HOST = getIp(body);
          return SDP_HOST;
        }).catch(function( reason ){
          winston.log( 'error', reason.message );
        });
      }
      break;
    case 'listEnvs':
      if( responseBody ){
        return listEnvs( responseBody );
      } else {
        startAjaxCall( requestOptions ).catch(function( reason ){
          winston.log( 'error', reason.message );
        }).then( function( body ){
          responseBody = body;
          return listEnvs( responseBody );
        }).catch(function( reason ){
          winston.log( 'error', reason.message );
        });
      }    
      break;
    case 'initM2':
      if( !fs.existsSync(process.env.HOME + '/.m2/settings.xml') ){
        shell.mkdir(process.env.HOME + '/.m2');
        shell.cp( props.paths['bloomies-ui-reapps'] + '/settings.xml', process.env.HOME + '/.m2');
      } else {
        winston.log( 'info', '~/.m2 directory already exists.');
      }
      break;
    case 'updateSdpHost':
      actionHandler( 'updateNavAppSdpHost');
      actionHandler( 'updateShopAppSdpHost');
      break;
    case 'updateNavAppSdpHost':
      if( SDP_HOST ){
        return updateAppProperty( navAppConfigProperties, [{"name": "SDP_HOST", "value": "http://" + SDP_HOST + ":85"}] );
      } else {
        return actionHandler( 'getIp' ).then(function( response ){
          actionHandler( 'updateNavAppSdpHost' );
        });
      }
      break;
    case 'updateShopAppSdpHost':
      if( SDP_HOST ){
        return updateAppProperty( shopAppConfigProperties, [{"name": "SDP_HOST", "value": "http://" + SDP_HOST + ":85"}] );
      } else {
        actionHandler( 'getIp' ).then(function( response ){
          actionHandler( 'updateShopAppSdpHost' );
        });
      }
      break;
    case 'setNavAppDomainPrefix':
      return setNavAppDomainPrefix( navAppConfigProperties );
      break;
    case 'setShopAppDomainPrefix':
      return setShopAppDomainPrefix( shopAppConfigProperties );
      break;
    case 'initNavAppEnv':
      return actionHandler( 'setNavAppDomainPrefix' ).then(function( result ){
          return actionHandler( 'updateNavAppPomXml' );
        }).then(function( result){
          return actionHandler( 'updateNavAppWebXml' );
        }).then( function( result ){
          return updateAppProperty( navAppConfigProperties, props.navAppProperties );
        }).then( function( result ){
          return actionHandler( 'updateNavAppSdpHost' );
        });
      break;
    case 'initShopAppEnv':
      return actionHandler( 'setShopAppDomainPrefix' ).then(function( result){
        return actionHandler( 'updateShopAppPomXml' );
      }).then(function( result){
        return actionHandler( 'updateShopAppWebXml' );
      }).then(function( result ){
        return updateAppProperty( shopAppConfigProperties, props.shopAppProperties );
      }).then( function( result ){
          return actionHandler( 'updateShopAppSdpHost' );
        });
      break;
    case 'initEnvs':
      return actionHandler( 'initNavAppEnv' ).then(function( response ){
        actionHandler( 'initShopAppEnv' );
        actionHandler( 'initBloomiesAssets' );
      });
      break;
    case 'initHttpdSsl':
      httpdSsl.update();
      break;
    case 'initBox':
      actionHandler( 'initEnvs' ).then(function( response ){
        actionHandler( 'initM2' );
        actionHandler( 'initShell' );      
        actionHandler( 'initProxy' );
        actionHandler( 'initHttpdSsl' );
        actionHandler( 'initHosts' );
        actionHandler( 'initCertAndKey' );
      });
      break;
    case 'initCertAndKey':
      //MobileCustomerAppUI certificate and key (secure-m)
      proxyServer.updateCertOrKey( props.proxyServer, 'cert', 'crt' );
      proxyServer.updateCertOrKey( props.proxyServer, 'cert', 'key' );
      //ShopNServe and NavApp certificate and key
      proxyServer.updateCertOrKey( props.proxyServer, 'server', 'crt' );
      proxyServer.updateCertOrKey( props.proxyServer, 'server', 'key' );
      break;
    case 'initProxy':
      switch( props.proxyServer.name ){
        case 'apache24':
          proxy.update( props.domainPrefix );
          break;
        case 'nginx':
          actionHandler( 'initServerBlocks' );
          break;
        default:
          winston.log('error', 'ReappsJS does not support this server.  Check proxyServer in reapps-properties.json.')
          break;
      }
      break;
    case 'initShell':
      initShell();
      break;
    case 'initHosts':
      hosts.update('/etc/hosts');
      break;
    case 'initServerBlocks':
      proxyServer.updateServerBlocks( props.proxyServer, 'navAppBcom', 'conf');
      proxyServer.updateServerBlocks( props.proxyServer, 'secureM', 'conf');
      proxyServer.updateServerBlocks( props.proxyServer, 'shopAppBcom', 'conf');
      break;
    case 'initBloomiesAssets':
      bloomiesAssets.update( props.username, props.paths.bloomiesAssets);
      break;
    case 'getGceIp':
      getGceIp();
      break;
    case 'updateNavAppPomXml':
      if( props.paths.navApp ){
        return updateNavAppPomXml();
      } else {
        winston.log('info', 'Trying to update NavApp pom.xml? Enter path to NavApp repo in reapps-properties.json.');
      }
      break;
    case 'updateShopAppPomXml':
      if( props.paths.shopApp ){
        return updateShopAppPomXml();
      } else {
        winston.log('info', 'Trying to update ShopApp pom.xml? Enter path to ShopApp repo in reapps-properties.json.');
      }
      break;
    case 'updateNavAppTmp':
      if( props.paths.tmp && argv.killSwitchList ){
        updateTmp( props.paths.tmp + '/properties/local/bcom/navapp/killswitch.properties', argv.killSwitchList.split(","));
      }
      break;
    case 'updateShopAppTmp':
      if( props.paths.tmp && argv.killSwitchList ){
        updateTmp( props.paths.tmp + '/properties/local/bcom/shopapp/killswitch.properties', argv.killSwitchList.split(","));
      }
      break;      
    case 'updateNavAppWebXml':
      if( props.paths.navApp ){
        return updateWebXml( props.paths.navApp + "BloomiesNavApp/BloomiesNavAppWeb/src/main/webapp/WEB-INF/web.xml");
      } else {
        winston.log('info', 'Trying to update NavApp web.xml? Enter path to NavApp repo in reapps-properties.json.');
      }
      break;
    case 'updateShopAppWebXml':
      if( props.paths.shopApp ){
        return updateWebXml( props.paths.shopApp + "BCOM/BloomiesShopNServe/src/main/webapp/WEB-INF/web.xml");
      } else {
        winston.log('info', 'Trying to update ShopApp web.xml? Enter path to ShopApp repo in reapps-properties.json.');
      }
      break;
    default:
      if( !argv.save ){
        winston.log('error', 'No action specified or action not recognized.  Try --action=[actionName].');
      }
  }
}

if( argv.save ){
  jsonfile.writeFile(props.paths['bloomies-ui-reapps'] + '/reapps-properties.json', props, {spaces: 2}, function (err) {    
    if( err ){
      winston.log('error', err.message);
    } else {
      winston.log('info', 'saved options to reapps-properties.json \n' + options);
      actionHandler( argv.action );
    }
  });
} else {
  actionHandler( argv.action );
}