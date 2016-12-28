var fs = require('fs'),
    winston = require( 'winston'),
    argv = require('yargs').argv,
    shell = require('shelljs');

function compileTemplate( domainPrefix ){ 
  
return `ProxyTimeout 600 

# proxy rewrite stuff
RewriteEngine on

SSLProxyEngine on
SSLProxyVerify none 
SSLProxyCheckPeerCN off
SSLProxyCheckPeerName off
SSLProxyCheckPeerExpire off

#ProxyRequests     off
ProxyPreserveHost off
#ProxyPreserveHost turned off to load dyn_img folder properly

# Log to a file:
#RewriteLog "logs/rewrite.log"
#RewriteLogLevel 1

RewriteCond %{HTTP_HOST} ^mlocal.(.*)$
RewriteRule ^/(.*)$ http://${domainPrefix}.bloomingdales.fds.com:8080/$1 [P]
#secure-m
#QA11
#RewriteCond %{HTTP_HOST} ^local.secure-m.(.*)$
#RewriteRule ^/api/(.*)$ http://secure-m.qa10codebloomingdales.fds.com/api/$1 [P]

ProxyPass /livereload.js http://${domainPrefix}.bloomingdales.fds.com:35740/livereload.js

RewriteCond %{HTTP_HOST} ^local.secure-m.(.*)$
RewriteRule ^/(.*)$ http://127.0.0.1:8080/$1 [P]

#RewriteCond %{HTTP_HOST} ^mdevlocal.(.*)$
#RewriteRule ^/(.*)$ https://127.0.0.1:9086/$1 [P]

#Polaris
# ProxyPass /css http://${domainPrefix}.bloomingdales.fds.com:8082/css
# ProxyPass /js http://${domainPrefix}.bloomingdales.fds.com:8082/js

#QA8
#ProxyPass /web20/assets/script/bloomies/findItInStore/ http://${domainPrefix}.bloomingdales.fds.com:9876/web20/assets/script/bloomies/findItInStore/
#ProxyPass / http://www.qa8codebloomingdales.fds.com/
#ProxyPass /js http://${domainPrefix}.bloomingdales.fds.com:9876/js
#ProxyPass / https://www.qa15codebloomingdales.fds.com/



#Mobile Assets
ProxyPass /mew/assets/stylesheets/.css http://${domainPrefix}.bloomingdales.fds.com:3003/stylesheets/prod/.css
ProxyPass /mew/assets http://${domainPrefix}.bloomingdales.fds.com:3003

ProxyPass /index.jsp https://${domainPrefix}.bloomingdales.fds.com:9443/index.jsp

# catalog pages 
ProxyPass /p404 http://${domainPrefix}.bloomingdales.fds.com:2202/p404
ProxyPass /p500 http://${domainPrefix}.bloomingdales.fds.com:2202/p500
ProxyPass /catalog/product/availabilityCheck http://${domainPrefix}.bloomingdales.fds.com:2202/catalog/product/availabilityCheck
ProxyPass /catalog/category/facetedmeta http://${domainPrefix}.bloomingdales.fds.com:2202/catalog/category/facetedmeta
ProxyPass /catalog/product/thumbnail http://${domainPrefix}.bloomingdales.fds.com:2202/catalog/product/thumbnail
ProxyPass /catalog/product/quickview http://${domainPrefix}.bloomingdales.fds.com:2202/catalog/product/quickview
ProxyPass /catalog/replicate http://${domainPrefix}.bloomingdales.fds.com:2202/catalog/replicate
ProxyPass /catalog/index.ognc http://${domainPrefix}.bloomingdales.fds.com:2202/catalog/index.ognc
ProxyPass /catalog/product/index.ognc http://${domainPrefix}.bloomingdales.fds.com:2202/shop/catalog/product
#ProxyPass /catalog/product/index.ognc http://${domainPrefix}.bloomingdales.fds.com:9681/catalog/product/index.ognc
ProxyPass /registry/wedding/catalog/index.ognc http://${domainPrefix}.bloomingdales.fds.com:2202/registry/wedding/catalog/index.ognc
ProxyPass /shop http://${domainPrefix}.bloomingdales.fds.com:2202/shop
ProxyPass /shop http://${domainPrefix}.bloomingdales.fds.com:2224/shop

# registry pages
#ProxyPass /registry/wedding/catalog/index.ognc http://${domainPrefix}.bloomingdales.fds.com:2202/registry/wedding/catalog/index.ognc
ProxyPass /registry/wedding/registryhome https://${domainPrefix}.bloomingdales.fds.com:9443/registry/wedding/registryhome

# pdp pages
ProxyPass /bag/add http://${domainPrefix}.bloomingdales.fds.com:2202/bag/add
ProxyPass /bag/update http://${domainPrefix}.bloomingdales.fds.com:2202/bag/update
ProxyPass /bag/view http://${domainPrefix}.bloomingdales.fds.com:2202/bag/view
ProxyPass /bag/remove http://${domainPrefix}.bloomingdales.fds.com:2202/bag/remove
ProxyPass /bag/registryadd http://${domainPrefix}.bloomingdales.fds.com:2202/bag/registryadd
ProxyPass /bag/recommendations http://${domainPrefix}.bloomingdales.fds.com:2202/bag/recommendations
ProxyPass /bag/expressCheckout http://${domainPrefix}.bloomingdales.fds.com:2202/bag/expressCheckout
ProxyPass /bag/continuecheckout http://${domainPrefix}.bloomingdales.fds.com:2202/bag/continuecheckout
ProxyPass /bag/index.ognc http://${domainPrefix}.bloomingdales.fds.com:2202/bag/index.ognc
ProxyPass /bag/shippingfees http://${domainPrefix}.bloomingdales.fds.com:2202/bag/shippingfees
ProxyPass /bag http://${domainPrefix}.bloomingdales.fds.com:2202/bag

#checkout
ProxyPass /swf https://${domainPrefix}.bloomingdales.fds.com:9644/swf
ProxyPassReverse /swf https://${domainPrefix}.bloomingdales.fds.com:9644/swf
ProxyPassReverse /swf https://${domainPrefix}.bloomingdales.fds.com:2202/swf
ProxyPassReverse /swf https://${domainPrefix}.bloomingdales.fds.com:9443/swf
ProxyPass /checkoutswf https://${domainPrefix}.bloomingdales.fds.com:9644/checkoutswf
#ProxyPass /checkoutswf/checkout-webflow https://${domainPrefix}.bloomingdales.fds.com:9443/chkout/startcheckout

# credit
ProxyPass /credit https://${domainPrefix}.bloomingdales.fds.com:9644/credit
ProxyPass /img/ts https://macys-o.scene7.com
ProxyPass /chat.ognc https://${domainPrefix}.bloomingdales.fds.com:9644/chat.ognc

#creditservice
ProxyPass /creditservice https://${domainPrefix}.bloomingdales.fds.com:9443/creditservice
ProxyPass /creditservice/marketing/benefits https://${domainPrefix}.bloomingdales.fds.com:9443/creditservice/marketing/benefits

# misc pages
ProxyPass /international/shipping/supportedCountry http://${domainPrefix}.bloomingdales.fds.com:2202/international/shipping/supportedCountry
ProxyPass /internationalContext/index.ognc http://${domainPrefix}.bloomingdales.fds.com:2202/localepreference
ProxyPass /localepreference http://${domainPrefix}.bloomingdales.fds.com:2202/localepreference
ProxyPass /international/priceData http://${domainPrefix}.bloomingdales.fds.com:2202/international/priceData

#ProxyPass /signin https://${domainPrefix}.bloomingdales.fds.com:9644/signin
ProxyPass /myinfo https://${domainPrefix}.bloomingdales.fds.com:9644/myinfo
#ProxyPass /registry http://${domainPrefix}.bloomingdales.fds.com:9681/registry
#ProxyPass /service https://${domainPrefix}.bloomingdales.fds.com:9644/service

#requireJS
#ProxyPass /web20/assets/script/requirejs https://${domainPrefix}.bloomingdales.fds.com:9443/web20/assets/script/requirejs

#SNS
ProxyPass /signin/index.ognc https://${domainPrefix}.bloomingdales.fds.com:9443/account/signin
ProxyPass /account https://${domainPrefix}.bloomingdales.fds.com:9443/account
ProxyPass /chkout https://${domainPrefix}.bloomingdales.fds.com:9443/chkout
ProxyPass /sns https://${domainPrefix}.bloomingdales.fds.com:9443/sns
ProxyPass /myinfo https://${domainPrefix}.bloomingdales.fds.com:9644/myinfo
ProxyPass /service https://${domainPrefix}.bloomingdales.fds.com:9443/service
ProxyPass /formTest.jsp https://${domainPrefix}.bloomingdales.fds.com:9443/formTest.jsp
ProxyPass /registry https://${domainPrefix}.bloomingdales.fds.com:9443/registry
ProxyPass /accountweb https://${domainPrefix}.bloomingdales.fds.com:9443/accountweb

#Assets
ProxyPass /web20 http://${domainPrefix}.bloomingdales.fds.com:2202/web20
ProxyPass /web20 http://${domainPrefix}.bloomingdales.fds.com:9876/web20
ProxyPass /img http://${domainPrefix}.bloomingdales.fds.com:9876/img
ProxyPass /css http://${domainPrefix}.bloomingdales.fds.com:9876/css
ProxyPass /javascript http://${domainPrefix}.bloomingdales.fds.com:9876/javascript
ProxyPass /js http://${domainPrefix}.bloomingdales.fds.com:9876/js
ProxyPass /templates http://${domainPrefix}.bloomingdales.fds.com:9876/templates
ProxyPass /styles http://${domainPrefix}.bloomingdales.fds.com:9876/styles

#dyn_img
ProxyPass /navapp/dyn_img http://www.bloomingdales.com/dyn_img
ProxyPass /dyn_img https://www.bloomingdales.com/dyn_img

#ProxyPass /navapp/dyn_img http://${domainPrefix}.bloomingdales.fds.com/dyn_img
#ProxyPass /dyn_img https://${domainPrefix}.bloomingdales.fds.com:9443/dyn_img

#NavApp Assets
ProxyPass /navapp/js http://${domainPrefix}.bloomingdales.fds.com:2202/js
ProxyPass /navapp/templates http://${domainPrefix}.bloomingdales.fds.com:2202/templates
ProxyPass /navapp/styles http://${domainPrefix}.bloomingdales.fds.com:2202/styles
ProxyPass /navapp/web20/assets/img/walletDashboard http://${domainPrefix}.bloomingdales.fds.com:2202/web20/assets/img/walletDashboard
#ProxyPass /navapp/web20/assets/script/macys http://${domainPrefix}.bloomingdales.fds.com:9876/web20/assets/script/macys
ProxyPass /navapp/ http://${domainPrefix}.bloomingdales.fds.com:2202/

#SDP
#QA10
#ProxyPass /api http://11.168.42.145:8080/api
#QA15
ProxyPass /api http://www.qa15codebloomingdales.fds.com/api

#loyallist
ProxyPass /loyallist/benefits http://${domainPrefix}.bloomingdales.fds.com:9080/loyallist/benefits
ProxyPass /loyallist https://${domainPrefix}.bloomingdales.fds.com:9443/loyallist
ProxyPass /loyallist/enrollment https://${domainPrefix}.bloomingdales.fds.com:9443/loyallist/enrollment
ProxyPass /loyallist/accountsummary https://${domainPrefix}.bloomingdales.fds.com:9443/loyallist/accountsummary

#Mobile
ProxyPass /stylesheets https://${domainPrefix}.bloomingdales.fds.com:9876/stylesheets

#Informant Calls
ProxyPass /shop/catalog/product/recentlyPurchased/ https://jcia6748:8180/shop/catalog/product/recentlyPurchased/
ProxyPass /sdp/rto/record/customeraction https://jcia6748:8180/sdp/rto/record/customeraction
ProxyPass /sdp/rto/request/recommendations http://jcia6748:8180/sdp/rto/request/recommendations

#WSSG
ProxyPass /WebsiteServicesGateway http://${domainPrefix}.bloomingdales.fds.com:8585/WebsiteServicesGateway

#OES
ProxyPass /OES http://${domainPrefix}.bloomingdales.fds.com:9876/OES

# default all the rest here
#ProxyPass / http://${domainPrefix}.bloomingdales.fds.com:9681/

# default all the rest here
# ProxyPass / http://${domainPrefix}.bloomingdales.fds.com:8082/
# ProxyPass / http://${domainPrefix}.bloomingdales.fds.com:2202/

ProxyPassReverse /bag https://${domainPrefix}.bloomingdales.fds.com:2202/bag

ProxyPassReverse /signin/signout.ognc http://${domainPrefix}.bloomingdales.fds.com:2202/signin/signout.ognc
#ProxyPassReverse / http://${domainPrefix}.bloomingdales.fds.com:9681/
ProxyPassReverse / http://${domainPrefix}.bloomingdales.fds.com:2202/
`;
}

function updateProxyFile( domainPrefix ){
  if( !fs.existsSync('/etc/apache2/other/proxy.conf') || argv.force ){
    fs.writeFile( './proxy.conf', compileTemplate( ), 'utf8', function (err) {
       if (err) return console.log(err);
       shell.exec('sudo cp ./proxy.conf /etc/apache2/other/proxy.conf');
       winston.log( 'info', 'proxy.conf file created in /etc/apache2/other/' );       
       shell.exec('sudo apachectl restart');
       winston.log('info', 'restarted apache2');
    });
  } else {
    winston.log( 'info', '/etc/apache2/other/proxy.conf already exists. To replace this file, run with --force');
  }  
}

module.exports = {
  update: updateProxyFile
};