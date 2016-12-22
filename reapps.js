var request = require('request'),
    winston = require('winston'),
    SSH = require('simple-ssh'),
    prompt = require('prompt'),
    hosts = require( './hosts.js'),
    bloomiesAssets = require( './bloomies-assets.js' ),
    shell = require('shelljs'),
    proxy = require('./proxy.js'),
    serverCrt = require('./server.crt.js'),
    serverKey = require('./server.key.js'),
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
    responseBody;

winston.cli();

// if( !props.navApp ){
//   winston.log('error', 'Must specify location to NavApp pom.xml');
// }

if( argv.brand ){
  props.brand = argv.brand;
}

if( argv.envName ){
  props.envName = argv.envName;
}

if( argv.branch ){
  props.branch = argv.branch;
}

if( argv.domainPrefix ){
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
  var environments = body.envDetails.map(function(element){
    return element.envName;
  });
  winston.log('info', 'List of Environments for '+ props.branch+' '+props.brand);
  console.log(environments);

  return environments;
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

function updateTmp( pathToTmp, killSwitchList ){
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
      return SDP_HOST;
      break;
    case 'listEnvs':
      return listEnvs( responseBody );
      break;
    case 'initM2':
      if( !fs.existsSync(process.env.HOME + '/.m2/settings.xml') ){
        shell.mkdir(process.env.HOME + '/.m2');
        shell.cp('./settings.xml', process.env.HOME + '/.m2');
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
        winston.log('info', 'Trying to update NavApp SDP_HOST? Enter path to NavApp repo in reapps-properties.json.');
      }
      break;
    case 'updateShopAppSdpHost':
      if( SDP_HOST ){
        return updateAppProperty( shopAppConfigProperties, [{"name": "SDP_HOST", "value": "http://" + SDP_HOST + ":85"}] );
      } else {
        winston.log('info', 'Trying to update ShopApp SDP_HOST? Enter path to ShopApp repo in reapps-properties.json.');
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
      actionHandler( 'initNavAppEnv' );
      actionHandler( 'initShopAppEnv' );
      actionHandler( 'initBloomiesAssets' );
      break;
    case 'initHttpdSsl':
      httpdSsl.update();
      break;
    case 'initBox':
      actionHandler( 'initM2' );
      actionHandler( 'initEnvs' );
      actionHandler( 'initShell' );
      actionHandler( 'initProxy' );
      actionHandler( 'initHosts' );
      actionHandler( 'initCertAndKey' );
      break;
    case 'initCertAndKey':
      shell.exec('sudo mkdir /etc/apache2/cert');
      if( !fs.existsSync('/etc/apache2/cert/server.crt') ){
        fs.writeFile( './server.crt', serverCrt, 'utf8', function (err) {
           if (err) return console.log(err);
           shell.exec('sudo cp ./server.crt /etc/apache2/cert/server.crt');
           winston.log( 'info', 'server.crt file created in /etc/apache2/cert/' );
           shell.exec('sudo apachectl restart');
           winston.log( 'info', 'restarted apache');
        });
      } else {
        winston.log( 'info', '/etc/apache2/cert/server.crt already exists.');
      }

      if( !fs.existsSync('/etc/apache2/cert/server.key') ){
        fs.writeFile( './server.key', serverKey, 'utf8', function (err) {
           if (err) return console.log(err);
           shell.exec('sudo cp ./server.key /etc/apache2/cert/server.key');
           winston.log( 'info', 'server.key file created in /etc/apache2/cert/' );           
           shell.exec('sudo apachectl restart');
           winston.log( 'info', 'restarted apache');
        });
      } else {
        winston.log( 'info', '/etc/apache2/cert/server.key already exists.');
      }
      
      fs.writeFile( '/etc/apache2/extra/httpd-ssl.conf', serverCrt, 'utf8', function (err) {
         if (err) return console.log(err);
         shell.exec('sudo cp ./server.crt /etc/apache2/cert/server.crt');
         winston.log( 'info', 'server.crt file created in /etc/apache2/cert/' );
         winston.log( 'info', 'restarting apache');
         shell.exec('sudo apachectl restart');
      });    
      break;
    case 'initProxy':
      proxy.update( props.domainPrefix );
      break;
    case 'initShell':
      initShell();
      break;
    case 'initHosts':
      hosts.update('/etc/hosts');
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
      if( props.paths.tmp){
        updateTmp();
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
      winston.log('error', 'No action specified or action not recognized.  Try --action=[actionName].');
  }
}

startAjaxCall( requestOptions ).catch(function( reason ){
  winston.log( 'error', reason.message );
}).then( function( body ){
  responseBody = body,
  SDP_HOST = getIp(body);
  return actionHandler( argv.action );
});