var reprops = require('./reapps-properties.json');

function gruntSupportCode(grunt) {
    'use strict';
    grunt.util.linefeed = '\n';
    
    var PROPERTIES_FILE = "assets-server-properties.json";

    function createPropertiesFile() {
        var defaultProps = {
                "base": reprops.paths.macysUi, 
                "watchDirs": ["src/bcom", "/src/common"],
                "removeOptimization": true,
                "keepOptimized": ["src/bcom/base/Common.js", "src/bcom/features/bops/BopsSelectedStore.js"],
                "assetsDir": `${reprops.paths.bloomiesAssets}/bloomies.war`, 
                "certificate": {
                    "dir": `${reprops.proxyServer.path}/cert`, 
                    "key": "server.key", 
                    "cert": "server.crt"
                }, 
                "secure": true
            },
            props,
            mergedProps = {},
            jquery,
            jsbeautify = require("js-beautify").js_beautify;
        
        if (grunt.file.exists(PROPERTIES_FILE)) {
            grunt.verbose.writeln("updating properties.json");
            props = JSON.parse(grunt.file.read(PROPERTIES_FILE));

            require("extend")(mergedProps, defaultProps, props);
            //grunt.verbose.error(JSON.stringify(mergedProps));

            grunt.file.write(PROPERTIES_FILE, jsbeautify(JSON.stringify(mergedProps)));
            
            return mergedProps;
        }
        else {
            grunt.verbose.writeln("creating properties.json");
            grunt.file.write(PROPERTIES_FILE, jsbeautify(JSON.stringify(defaultProps)));
            
            return defaultProps;
        }
    }

    function getProperties(  ) {
        return JSON.parse(grunt.file.read(PROPERTIES_FILE));
    }
    
    function removeLastSlash(text){
        if(text){
            return text.replace(/\/$/, "");
        }
        else {
            return text;
        }
    }
    
    function getOptimizedFilesList(watchDirs, doNotUnoptimizeList){
        var dest = grunt.config.get('meta.dest.js'),
            dir,
            arr = [];
        
        if( watchDirs ){
            if(doNotUnoptimizeList){
                doNotUnoptimizeList = doNotUnoptimizeList.map(function(entry){
                   return dest + "/" + entry.replace(/^src\//, "js/")
                });
            }
            
            watchDirs.forEach(function(subDir){
                dir = dest + "/" + subDir.replace(/^src\//, "js/");
                
                grunt.file.recurse(dir, function(file){
                    var doNotUnoptimize = false;
                    doNotUnoptimizeList.forEach(function(entry){
                        if(entry === file){
                            doNotUnoptimize = true;
                        }
                    })
                    if(doNotUnoptimize){
                        grunt.log.writeln("Will not unoptimize: ", file);
                    }
                    else {
                        if(grunt.file.read(file).indexOf("/* files in this bundle = [") !== -1){
                            arr.push(file);
                        }
                    }
                });
            });
        }
        
        return arr;
    }
    
    function getFilesList(arr, type, prepend, replaceSrcWith){
        var retVal,
            pattern;
        
        prepend = prepend || "";
        if(replaceSrcWith === undefined || replaceSrcWith === null){
            // no change; replace src with src
            replaceSrcWith = "src";
        }
       if(arr){
           if(!Array.isArray(arr)){
               arr = [arr];
           }
           
           switch (type){
                case "i18n":
                   pattern = "/**/i18n/**.js";
                   break;
               case "hbs":
                   pattern = "/**/**.hbs";
                   break;
                case "scss":
                   pattern = "/**/**.scss";
                   break;
               default:
                   pattern = "/**/*";
           }
           
           retVal = arr.map(function(val){
               return prepend + removeLastSlash(val).replace(/^src/, replaceSrcWith) + pattern;
           });
       }
        
        return retVal;
    }
    
    return {
        getOptimizedFilesList: getOptimizedFilesList,
        getFilesList: getFilesList,
        removeLastSlash: removeLastSlash,
        setProperties: createPropertiesFile
        //,
        //getProperties: getProperties
    };
}

module.exports = function ( grunt ) {

    'use strict';

    grunt.util.linefeed = '\n';

    var gruntSupport = gruntSupportCode(grunt),
        props = gruntSupport.setProperties(),
        cwd = process.cwd(),
        sslEnabled = false,
        targetDest,
        serverPort,
        i, npmTasks,
        taskName, zombie, eater,
        secure = props.secure,
        removeOptimization = props.removeOptimization,
        otherAssetsDirectory = props.assetsDir || ".",
        watchDirs = props.watchDirs.map(function(val){ return val.replace(/^\//, "");}),
        keepOptimized = props.keepOptimized.map(function(val){ return val.replace(/^\//, "");}),
        //projectDirectory = props.watchDirs[0] || "src",
        certKey,
        certCrt;
    
    props.base = gruntSupport.removeLastSlash(props.base) + "/";
    props.certificate.dir = gruntSupport.removeLastSlash(props.certificate.dir) + "/";
    
    if(secure){
        try {
            certKey = props.certificate.dir + props.certificate.key;
            certCrt = props.certificate.dir + props.certificate.cert;
            
            if(grunt.file.exists(certKey) && grunt.file.exists(certCrt)){
                certKey = grunt.file.read(certKey);
                certCrt = grunt.file.read(certCrt);
                
                grunt.log.writeln("Livereload serevr will start with secure port.");
            }
            else {
                certKey = null;
                certCrt = null;
                grunt.log.error("Certificate file does not exist.");
                grunt.log.writeln("Livereload serevr will start with non-secure port.");
            }
        }
        catch(e){
            grunt.log.error("Error while getting certificate values:", e);
            grunt.log.writeln("Livereload serevr will start with non-secure port.");
        }
    }
    else {
    	grunt.log.writeln("Livereload serevr will start with non-secure port.");
    }
    
    targetDest = grunt.option( "altDest" );
    serverPort = grunt.option( "port" ) || 9876;
    zombie = grunt.option( 'sourceFile' );
    eater = grunt.option( 'moduleName' );
    sslEnabled = grunt.option( 'ssl' );

    grunt.initConfig( {
      //  pkg: grunt.file.readJSON( 'package.json' ),
        notify: {
            livereload: {
                options: {
                    title: "Live Reload",
                    message: "Changes have been loaded."
                }
            }
        },
        
        meta: {
            src: {
            	js: props.base + "macysJS",
            	css: props.base + "macysCSS",
            	templates: props.base + "macysTemplates"/*,
            	root: projectDirectory*/
            },
            dest: {
            	styles: props.base + "macysJS/styles",
            	templates: props.base + "macysJS/templates",
            	js: props.base + "macysJS/target/classes"
            }/*,
            watch: {
            	js: projectDirectory.replace("src", "/js"),
            	styles: projectDirectory.replace("src", ""),
            	templates: projectDirectory.replace("src", "")
            }*/
        },
        
        copy: {
        	templates: {
	            files: [
	                    	{
	                    		expand: true,
	                    		cwd: '<%= meta.src.templates %>',
	                    		ext: ".js",
	                    		src: gruntSupport.getFilesList(watchDirs, "i18n"), 
	                    		dest: '<%= meta.dest.templates %>',
	                    		rename: function(dest, src){
	                    			return dest + src.replace(/^src/, "");
	                    		}
	                    	}
	            ]
	                
        	},
        	js: {
	            files: [
	                    	{
	                    		expand: true,
	                    		cwd: '<%= meta.src.js %>',
	                    		src: gruntSupport.getFilesList(watchDirs), 
	                    		dest: '<%= meta.dest.js %>',
	                    		rename: function(dest, src){
	                    			return dest + src.replace(/^src/, "/js");
	                    		}
	                    	}
	            ]
	                
        	}
        },
        
        /*uglify: {
            options: {
                maxLineLen: 10000,
                compress: {
                    "sequences": false,
                    "properties": false,
                    "dead_code": true,
                    "drop_debugger": true,
                    "unsafe": false,
                    "conditionals": false,
                    "comparisons": false,
                    "evaluate": false,
                    "booleans": false,
                    "loops": false,
                    "unused": false,
                    "hoist_funs": false,
                    "hoist_vars": true,
                    "if_return": false,
                    "join_vars": true,
                    "cascade": false,
                    "warnings": false,
                    "side_effects": false
                }
            },
            minify: {
                files: getMinifiedFileMap( 'src', 'vendor', targetDest || 'target/classes/js', 'js' )
            }
        },*/
        
        handlebars: {
            compile: {
            	 files: [
	                    	{
	                    		expand: true,
	                    		cwd: '<%= meta.src.templates %>',
	                    		ext: ".js",
	                    		src: gruntSupport.getFilesList(watchDirs, "hbs"), 
	                    		dest: '<%= meta.dest.templates %>',
	                    		rename: function(dest, src){
	                    			return dest + src.replace(/^src/, "");
	                    		}
	                    	}
	            ]
            },
            options: {
                namespace: false,
                amd: true
            }
        },
        
        /*compass: {
            sass: {
                options: {
                    sassDir: '<%= meta.src.css %>/src',
                    cssDir: '<%= meta.src.js %>/styles/',
                    imagesDir: '<%= meta.src.css %>/src'
                }
            }
        },*/

        sass: {
            dist: {
                files: [
	                    	{
	                    		expand: true,
	                    		cwd: '<%= meta.src.css %>',
	                    		ext: ".css",
	                    		src: gruntSupport.getFilesList(watchDirs, "scss"),
	                    		dest: '<%= meta.src.js %>/styles/',
	                    		rename: function(dest, src){
	                    			return dest + src.replace(/^src/, "");
	                    		}
	                    	}
	            ]
            }
        },
        
        watch: {
            scripts: {
                files: gruntSupport.getFilesList(watchDirs, null, "<%= meta.src.js %>/"),
                tasks: [ "watchJS" ]
            },
            templates: {
                files: gruntSupport.getFilesList(watchDirs, null, "<%= meta.src.templates %>/"),
                tasks: [ "watchTemplates" ]
            },
            CSS: {
                files: gruntSupport.getFilesList(watchDirs, null, "<%= meta.src.css %>/"),
                tasks: [ "watchCSS" ]
            },
            livereload: {
            	files: gruntSupport.getFilesList(watchDirs, null, "<%= meta.dest.templates %>/", "")
                        .concat(gruntSupport.getFilesList(watchDirs, null, "<%= meta.dest.styles %>/", ""))
                        .concat(gruntSupport.getFilesList(watchDirs, null, "<%= meta.dest.js %>/", "/js")),
                tasks: ['notify:livereload'],
                options: {
                    livereload: {
                    	port: 35729,
	                    key: certKey,
	                    cert: certCrt
                    }
                    
                }
            }
        },
        
        connect: {
            server: {
                options: {
                    port: serverPort,
                    livereload: 9001,
                    middleware: function ( connect, options ) {
                        var serveStatic = require( 'serve-static' ),
                            serveIndex = require( 'serve-index' ),
                            sIndex, 
                            sStatic
console.log('test2');
                        // terminate on Control-C
                        process.on( 'SIGINT', function () {
                            process.exit();
                        } );

                        return [
                            function ( req, res, next ) {
                                var dir,
                                	url = req.url;
                                
                                switch(url.split("/")[1]){
	                                case "js":
	                                	dir = props.base + "macysJS/target/classes";
	                                	break;
	                                case "styles":
	                                case "templates":
	                                	dir = props.base + "macysJS";
	                                	break;
	                                default:
	                                	dir = otherAssetsDirectory;
	                                break;
                                }
                                
                                //console.log("serving", url, dir);
                                sIndex = serveIndex( dir );
                                sStatic = serveStatic( dir );
                                sStatic( req, res, function onNext( err ) {
                                    if ( err ) {
                                        return next( err );
                                    }
                                    sIndex( req, res, next );
                                } );
                            }
                        ];
                    }
                }
            }
        }
    } );
    
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    //grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');
    
    // default tasks that get run
    grunt.registerTask( 'default', [ 'unoptimize', 'connect', 'watch'] );

    grunt.registerTask( 'unoptimize',function(){
        if(removeOptimization === false){
            grunt.log.writeln("NOT going to change the optimized file.....");
            return;
        }
        var list = gruntSupport.getOptimizedFilesList(watchDirs, keepOptimized);
        
        grunt.verbose.writeln("Going to unoptimize: ", list);
        
        list.forEach(function(file){
            var srcFile = file.replace("target/classes/js", "src");
                 
            grunt.file.copy(srcFile, file);
            grunt.log.write("Unoptimized: ", srcFile);
            grunt.log.ok();
        });
    } );
    
    //grunt.registerTask('properties', gruntSupport.setProperties);
    
    grunt.registerTask( 'watchTemplates', [ 'newer:handlebars', "newer:copy:templates"] );
    grunt.registerTask( 'watchCSS', [ 'sass'] );
    grunt.registerTask( 'watchJS', ["newer:copy:js"] );
    
    grunt.registerTask( 'watchTasks', [ 'newer:jsbeautifier:base', 'newer:jsbeautifier:codebase', 'newer:jsbeautifier:tests', 'newer:jshint', 'newer:copySourceFiles', 'newer:uglify' ] );
};
