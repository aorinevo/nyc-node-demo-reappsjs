var Table = require('cli-table'),
    winston = require('winston'),
    cliSpinners = require('cli-spinners'),
    ora = require('ora'),
    SSH = require('simple-ssh'),
    request = require('request'),
    prompt = require('prompt'),
    props = require('../../reapps-properties.json'),
    spinner = ora(cliSpinners.dots),
    fs = require('fs');

winston.cli();

function parseProperties( ){
  props.shopAppProperties.push({
    "name": "ASSETS_HOST", "value": `http://${props.domainPrefix}.bloomingdales.fds.com/sns`
  },{
    "name": "HOST", "value": `https://${props.domainPrefix}.bloomingdales.fds.com`
  },{
    "name": "SECURE_HOST", "value": `https://${props.domainPrefix}.bloomingdales.fds.com`
  });

  props.navAppProperties.push({
    "name": "ASSETS_HOST", "value": `http://${props.domainPrefix}.bloomingdales.fds.com/navapp`
  },{
    "name": "COMMON_ASSETS_HOST", "value": `http://${props.domainPrefix}.bloomingdales.fds.com`
  },{
    "name": "SECURE_HOST", "value": `https://${props.domainPrefix}.bloomingdales.fds.com`
  },{
    "name": "ASSETS_SECURE_HOST", "value": `https://${props.domainPrefix}.bloomingdales.fds.com/navapp`
  },{
    "name": "HOST", "value": `https://${props.domainPrefix}.bloomingdales.fds.com`
  });
  
  return props;
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

function getIp( sdpHost ){
  if( sdpHost ){
    return sdpHost;
  } else {
    return startAjaxCall( requestOptions ).catch(function( reason ){
      winston.log( 'error', reason.message );
    }).then( function( body ){
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
    }).catch(function( reason ){
      winston.log( 'error', reason.message );
    });
  }
}
// 
// function getGceIp(){
//   prompt.start();
//   prompt.get([{
//     name: 'password',
//     required: true,
//     hidden: true
//    }], function (err, result) {
//     var ssh = new SSH({
//       host: 'sns.'+props.envName+'.c4d.devops.fds.com',
//       user: props.username,
//       pass: result.password
//     }).exec("cat /usr/jboss/jbosseap/sns_master/configuration/environment.properties | grep '^SDP_HOST='", {
//         err: function(stderr) {
//           winston.log('error', 'Could not ssh into GCE ' + props.envName + '. Is this a GCE? Is the GCE available?');
//         },
//         out: function(stdout) {
//           winston.log('info', 'GCE '+ props.envName + ': ' + stdout.trim());
//         }
//     }).exec('exit').start();
//   });
// }
// 
function listEnvs( body ){
  return new Promise(function(resolve, reject){
    if( body ){
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
      resolve(table);
    } else {
      resolve(startAjaxCall( requestOptions ).catch(function( reason ){
        winston.log( 'error', reason.message );
      }).then( function( body ){
        listEnvs( body );
        return body;
      }).catch(function( reason ){
        winston.log( 'error', reason.message );
      }));
    } 
  });
}

module.exports = {
  parseProperties: parseProperties,
  updateWebXml: updateWebXml,
  updateTmp: updateTmp,
  getIp: getIp,
  listEnvs: listEnvs,
  updateAppProperty: updateAppProperty
}