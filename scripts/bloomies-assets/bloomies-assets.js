var fs = require('fs'),
    winston = require( 'winston');

function updatePomXml( username, pathToNavApp ){
  var lineBeforeInsert = `<!-- Do NOT Commit: You can uncomment these for your local development use and replace the values with your respective project paths.-->`,
      expectedLocations = `<com.bloomies.webapp.macysCSS.location>/Users/${username}/Repositories/MacysUI/macysCSS/target/classes</com.bloomies.webapp.macysCSS.location>
                           <com.bloomies.webapp.macysJS.location>/Users/${username}/Repositories/MacysUI/macysJS/target/classes</com.bloomies.webapp.macysJS.location>
                           <com.bloomies.webapp.macysTemplates.location>/Users/${username}/Repositories/MacysUI/macysTemplates/target/classes</com.bloomies.webapp.macysTemplates.location>`,
      pathToProps = pathToNavApp + "pom.xml",
      result;

    return new Promise(function( resolve, reject ){
      fs.readFile( pathToProps, 'utf8', function (err,data) {
        if (err) {
          winston.log('error', err);
          reject( err );
        }
        
        var result = data;

        if( result.indexOf( expectedLocations ) == -1 ){
          result = result.replace( lineBeforeInsert, lineBeforeInsert + "\n" + expectedLocations );
        }

        fs.writeFile( pathToProps, result, 'utf8', function (err) {
          if (err) {
            winston.log('error', err);
            reject( err );
          }
           winston.log('info', 'Updated BloomiesAssets pom.xml.');
          resolve( result );
        });
      });
    });
}

module.exports = {
  update: updatePomXml
};