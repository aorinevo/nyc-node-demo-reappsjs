var props = require('./reapps-properties.json'),
    fs = require('fs'),
    winston = require( 'winston'),
    shell = require('shelljs'),
    argv = require('yargs').argv;

function compileTemplate( ){ 
  
return `# Virtual Hosts
#
# Required modules: mod_log_config

# If you want to maintain multiple domains/hostnames on your
# machine you can setup VirtualHost containers for them. Most configurations
# use only name-based virtual hosts so the server doesn't need to worry about
# IP addresses. This is indicated by the asterisks in the directives below.
#
# Please see the documentation at 
# <URL:http://httpd.apache.org/docs/2.4/vhosts/>
# for further details before you try to setup virtual hosts.
#
# You may use the command line option '-S' to verify your virtual host
# configuration.

#
# VirtualHost example:
# Almost any Apache directive may go into a VirtualHost container.
# The first VirtualHost section is used for all requests that do not
# match a ServerName or ServerAlias in any <VirtualHost> block.
#

LoadModule ssl_module libexec/apache2/mod_ssl.so
LoadModule vhost_alias_module libexec/apache2/mod_vhost_alias.so

<VirtualHost *:80>    
    SSLCertificateFile "/private/etc/apache2/cert/server.crt"
    SSLCertificateKeyFile "/private/etc/apache2/cert/server.key"
    ServerName ${props.domainPrefix}.bloomingdales.fds.com
    ServerAlias www.${props.domainPrefix}.bloomingdales.fds.com
    
    ProxyPass / http://${props.domainPrefix}.bloomingdales.fds.com:2202/
    #Mobile Assets
    ProxyPass /mew/assets/stylesheets/.css http://${props.domainPrefix}.bloomingdales.fds.com:3003/stylesheets/prod/.css
    ProxyPass /mew/assets http://${props.domainPrefix}.bloomingdales.fds.com:3003

    ProxyPass /index.jsp https://${props.domainPrefix}.bloomingdales.fds.com:9443/index.jsp

    ProxyPassReverse / http://${props.domainPrefix}.bloomingdales.fds.com:2202/        
</VirtualHost>

Listen 443

<VirtualHost *:443>    
    SSLEngine on  
    SSLProxyEngine on 
    SSLProxyVerify none 
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    SSLProxyCheckPeerExpire off
    ProxyPreserveHost off        
    SSLCertificateFile "/private/etc/apache2/cert/server.crt"
    SSLCertificateKeyFile "/private/etc/apache2/cert/server.key"
    ServerName ${props.domainPrefix}.bloomingdales.fds.com
    ServerAlias www.${props.domainPrefix}.bloomingdales.fds.com

    # Scene7 (Page titles for pages like Sign In page)
    ProxyPass /img/ts https://macys-o.scene7.com

    # SNS Assets
    ProxyPass /sns/signin/index.ognc https://${props.domainPrefix}.bloomingdales.fds.com:9443/account/signin
    ProxyPass /sns/web20/assets https://${props.domainPrefix}.bloomingdales.fds.com:9443/sns/web20/assets
    ProxyPass /sns/web20/assets http://${props.domainPrefix}.bloomingdales.fds.com:9876/web20/assets
    ProxyPass /sns/web20 https://${props.domainPrefix}.bloomingdales.fds.com:9443/web20
    ProxyPass /sns/styles https://${props.domainPrefix}.bloomingdales.fds.com:9443/styles
    ProxyPass /sns/js https://${props.domainPrefix}.bloomingdales.fds.com:9443/js
    ProxyPass /sns/dyn_img https://www.bloomingdales.com/dyn_img
    ProxyPass /sns/javascript https://${props.domainPrefix}.bloomingdales.fds.com:9443/javascript
    ProxyPass /sns/img http://${props.domainPrefix}.bloomingdales.fds.com:9876/img
    ProxyPass /sns/ https://${props.domainPrefix}.bloomingdales.fds.com:9443/
    
    # SNS Pages
    ProxyPass /account https://${props.domainPrefix}.bloomingdales.fds.com:9443/account
    ProxyPass /creditservice https://${props.domainPrefix}.bloomingdales.fds.com:9443/creditservice
    ProxyPass /loyallist/benefits http://${props.domainPrefix}.bloomingdales.fds.com:9080/loyallist/benefits
    ProxyPass /loyallist https://${props.domainPrefix}.bloomingdales.fds.com:9443/loyallist
    ProxyPass /chkout https://${props.domainPrefix}.bloomingdales.fds.com:9443/chkout

    # NavApp Assets
    ProxyPass /navapp/web20/assets http://${props.domainPrefix}.bloomingdales.fds.com:2202/web20/assets
    ProxyPass /navapp/web20 http://${props.domainPrefix}.bloomingdales.fds.com:2202/web20
    ProxyPass /navapp/css http://${props.domainPrefix}.bloomingdales.fds.com:2202/css
    ProxyPass /navapp/styles http://${props.domainPrefix}.bloomingdales.fds.com:2202/styles
    ProxyPass /navapp/js http://${props.domainPrefix}.bloomingdales.fds.com:2202/js
    ProxyPass /navapp/dyn_img http://www.bloomingdales.com/dyn_img
    ProxyPass /navapp/javascript http://${props.domainPrefix}.bloomingdales.fds.com:2202/javascript
    ProxyPass /navapp/img http://${props.domainPrefix}.bloomingdales.fds.com:9876/img
    ProxyPass /navapp/ http://${props.domainPrefix}.bloomingdales.fds.com:2202/
    
    # NavApp Pages
    ProxyPass /international http://${props.domainPrefix}.bloomingdales.fds.com:2202/international
    ProxyPass /bag http://${props.domainPrefix}.bloomingdales.fds.com:2202/bag

    ProxyPass /dyn_img http://www.bloomingdales.com/dyn_img

    # BloomiesAssets
    ProxyPass /js http://${props.domainPrefix}.bloomingdales.fds.com:9876/js
    ProxyPass /javascript http://${props.domainPrefix}.bloomingdales.fds.com:9876/javascript
    ProxyPass /templates http://${props.domainPrefix}.bloomingdales.fds.com:9876/templates
    ProxyPass /styles http://${props.domainPrefix}.bloomingdales.fds.com:9876/styles
    ProxyPass /img http://${props.domainPrefix}.bloomingdales.fds.com:9876/img
    ProxyPass /web20 http://${props.domainPrefix}.bloomingdales.fds.com:9876/web20

    # FOBs Redirect
    ProxyPass /catalog/index.ognc http://${props.domainPrefix}.bloomingdales.fds.com:2202/catalog/index.ognc
    
    # Header data
    ProxyPass /shop http://${props.domainPrefix}.bloomingdales.fds.com:2202/shop
    
    ProxyPass /index.jsp https://${props.domainPrefix}.bloomingdales.fds.com:9443/index.jsp

    #checkout
    ProxyPassReverse /swf https://${props.domainPrefix}.bloomingdales.fds.com:2202/swf
    ProxyPassReverse /swf https://${props.domainPrefix}.bloomingdales.fds.com:9443/swf
    #ProxyPass /checkoutswf/checkout-webflow https://${props.domainPrefix}.bloomingdales.fds.com:9443/chkout/startcheckout

    ProxyPass /api http://www.${props.envName}.fds.com/api

    #Informant Calls
    ProxyPass /shop/catalog/product/recentlyPurchased/ https://www.${props.envName}.fds.com:8180/shop/catalog/product/recentlyPurchased/
    ProxyPass /sdp/rto/record/customeraction https://www.${props.envName}.fds.com:8180/sdp/rto/record/customeraction
    ProxyPass /sdp/rto/request/recommendations http://www.${props.envName}.fds.com:8180/sdp/rto/request/recommendations

    #ProxyPassReverse /bag https://${props.domainPrefix}.bloomingdales.fds.com:2202/bag

    ProxyPassReverse /signin/signout.ognc http://${props.domainPrefix}.bloomingdales.fds.com:2202/signin/signout.ognc   
</VirtualHost>  

<VirtualHost *:443>    
    SSLEngine on   
    SSLCertificateFile "/private/etc/apache2/cert/cert.crt"
    SSLCertificateKeyFile "/private/etc/apache2/cert/cert.key" 
    ServerName local.secure-m.${props.envName}.fds.com
    ServerAlias www.local.secure-m.${props.envName}.fds.com
    ProxyPass /api http://secure-m.${props.envName}.fds.com/api
    ProxyPass / http://127.0.0.1:8080/   
</VirtualHost>                               
`;
}

function updateHttpdVhostsFile( domainPrefix ){
  if( !fs.existsSync('/etc/apache2/other/bcom-httpd-vhosts.conf') || argv.force ){
    fs.writeFile( './bcom-httpd-vhosts.conf', compileTemplate( ), 'utf8', function (err) {
       if (err) return console.log(err);
       shell.exec('sudo mv ./bcom-httpd-vhosts.conf /etc/apache2/other/bcom-httpd-vhosts.conf');
       winston.log( 'info', 'created in /etc/apache2/other/bcom-httpd-vhosts.conf' );       
       shell.exec( 'sudo apachectl restart');
       winston.log('info', 'restarted apache2');
    });
  } else {
    winston.log( 'info', '/etc/apache2/other/bcom-httpd-vhosts.conf already exists. To replace this file, run with --force');
  }
}

module.exports = {
  update: updateHttpdVhostsFile
};