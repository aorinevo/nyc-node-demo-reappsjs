var fs = require('fs'),
    winston = require( 'winston'),
    shell = require('shelljs');

function initShell( pathToFile, props ){
  fs.readFile( pathToFile, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result,
        newLines = "";
    
    result = data.replace(/^export JAVA_HOME=.+/gm, 'export JAVA_HOME='+ props.libPaths.javaHome)
                 .replace(/^export MAVEN_HOME=.+/gm, 'export MAVEN_HOME='+ props.libPaths.mavenHome)
                 .replace(/^export MAVEN_OPTS=.+/gm, 'export MAVEN_OPTS='+ props.libPaths.mavenOpts);

    if( data.indexOf("export JAVA_HOME")== -1){
      console.log('test');
     newLines = newLines + 'export JAVA_HOME='+ props.libPaths.javaHome + '\n';
    }
    
    if( data.indexOf("export MAVEN_HOME")== -1){
     newLines = newLines + 'export MAVEN_HOME='+ props.libPaths.mavenHome + '\n';
    }   
    
    if( data.indexOf("export MAVEN_OPTS")== -1){
     newLines = newLines + 'export MAVEN_OPTS='+ props.libPaths.mavenOpts + '\n';
    }        
  
    if( data.indexOf("export M2_OPTS=$MAVEN_OPTS")== -1){
      newLines = newLines + "export M2_OPTS=$MAVEN_OPTS\n";
    }
    
    if( data.indexOf("export PATH=$MAVEN_HOME/bin:$JAVA_HOME/bin:$PATH")== -1){
      newLines = newLines + "export PATH=$MAVEN_HOME/bin:$JAVA_HOME/bin:$PATH\n";
    }

    if( newLines || data != result ){
      if( newLines ){
        result = newLines + "\n" + result;
      }
      fs.writeFile( pathToFile, result, 'utf8', function (err) {
         if (err) return console.log(err);
         console.log('source ' + pathToFile);
         shell.exec('source ' + pathToFile);
      });
    } else {
      winston.log('info', 'there is nothing to update in shell profile.');
    }
  });
}

module.exports = {
  init: initShell
}