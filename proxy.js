var props = require('./reapps-properties.json');

module.exports = `ProxyTimeout 600 

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
RewriteRule ^/(.*)$ http://${props.domainPrefix}.bloomingdales.fds.com:8080/$1 [P]
#secure-m
#QA11
#RewriteCond %{HTTP_HOST} ^local.secure-m.(.*)$
#RewriteRule ^/api/(.*)$ http://secure-m.qa10codebloomingdales.fds.com/api/$1 [P]

ProxyPass /livereload.js http://${props.domainPrefix}.bloomingdales.fds.com:35740/livereload.js

RewriteCond %{HTTP_HOST} ^local.secure-m.(.*)$
RewriteRule ^/(.*)$ http://127.0.0.1:8080/$1 [P]

#RewriteCond %{HTTP_HOST} ^mdevlocal.(.*)$
#RewriteRule ^/(.*)$ https://127.0.0.1:9086/$1 [P]

#Polaris
# ProxyPass /css http://${props.domainPrefix}.bloomingdales.fds.com:8082/css
# ProxyPass /js http://${props.domainPrefix}.bloomingdales.fds.com:8082/js

#QA8
#ProxyPass /web20/assets/script/bloomies/findItInStore/ http://${props.domainPrefix}.bloomingdales.fds.com:9876/web20/assets/script/bloomies/findItInStore/
#ProxyPass / http://www.qa8codebloomingdales.fds.com/
#ProxyPass /js http://${props.domainPrefix}.bloomingdales.fds.com:9876/js
#ProxyPass / https://www.qa15codebloomingdales.fds.com/



#Mobile Assets
ProxyPass /mew/assets/stylesheets/.css http://${props.domainPrefix}.bloomingdales.fds.com:3003/stylesheets/prod/.css
ProxyPass /mew/assets http://${props.domainPrefix}.bloomingdales.fds.com:3003

ProxyPass /index.jsp https://${props.domainPrefix}.bloomingdales.fds.com:9443/index.jsp

# catalog pages 
ProxyPass /p404 http://${props.domainPrefix}.bloomingdales.fds.com:2202/p404
ProxyPass /p500 http://${props.domainPrefix}.bloomingdales.fds.com:2202/p500
ProxyPass /catalog/product/availabilityCheck http://${props.domainPrefix}.bloomingdales.fds.com:2202/catalog/product/availabilityCheck
ProxyPass /catalog/category/facetedmeta http://${props.domainPrefix}.bloomingdales.fds.com:2202/catalog/category/facetedmeta
ProxyPass /catalog/product/thumbnail http://${props.domainPrefix}.bloomingdales.fds.com:2202/catalog/product/thumbnail
ProxyPass /catalog/product/quickview http://${props.domainPrefix}.bloomingdales.fds.com:2202/catalog/product/quickview
ProxyPass /catalog/replicate http://${props.domainPrefix}.bloomingdales.fds.com:2202/catalog/replicate
ProxyPass /catalog/index.ognc http://${props.domainPrefix}.bloomingdales.fds.com:2202/catalog/index.ognc
ProxyPass /catalog/product/index.ognc http://${props.domainPrefix}.bloomingdales.fds.com:2202/shop/catalog/product
#ProxyPass /catalog/product/index.ognc http://${props.domainPrefix}.bloomingdales.fds.com:9681/catalog/product/index.ognc
ProxyPass /registry/wedding/catalog/index.ognc http://${props.domainPrefix}.bloomingdales.fds.com:2202/registry/wedding/catalog/index.ognc
ProxyPass /shop http://${props.domainPrefix}.bloomingdales.fds.com:2202/shop
ProxyPass /shop http://${props.domainPrefix}.bloomingdales.fds.com:2224/shop

# registry pages
#ProxyPass /registry/wedding/catalog/index.ognc http://${props.domainPrefix}.bloomingdales.fds.com:2202/registry/wedding/catalog/index.ognc
ProxyPass /registry/wedding/registryhome https://${props.domainPrefix}.bloomingdales.fds.com:9443/registry/wedding/registryhome

# pdp pages
ProxyPass /bag/add http://${props.domainPrefix}.bloomingdales.fds.com:2202/bag/add
ProxyPass /bag/update http://${props.domainPrefix}.bloomingdales.fds.com:2202/bag/update
ProxyPass /bag/view http://${props.domainPrefix}.bloomingdales.fds.com:2202/bag/view
ProxyPass /bag/remove http://${props.domainPrefix}.bloomingdales.fds.com:2202/bag/remove
ProxyPass /bag/registryadd http://${props.domainPrefix}.bloomingdales.fds.com:2202/bag/registryadd
ProxyPass /bag/recommendations http://${props.domainPrefix}.bloomingdales.fds.com:2202/bag/recommendations
ProxyPass /bag/expressCheckout http://${props.domainPrefix}.bloomingdales.fds.com:2202/bag/expressCheckout
ProxyPass /bag/continuecheckout http://${props.domainPrefix}.bloomingdales.fds.com:2202/bag/continuecheckout
ProxyPass /bag/index.ognc http://${props.domainPrefix}.bloomingdales.fds.com:2202/bag/index.ognc
ProxyPass /bag/shippingfees http://${props.domainPrefix}.bloomingdales.fds.com:2202/bag/shippingfees
ProxyPass /bag http://${props.domainPrefix}.bloomingdales.fds.com:2202/bag

#checkout
ProxyPass /swf https://${props.domainPrefix}.bloomingdales.fds.com:9644/swf
ProxyPassReverse /swf https://${props.domainPrefix}.bloomingdales.fds.com:9644/swf
ProxyPassReverse /swf https://${props.domainPrefix}.bloomingdales.fds.com:2202/swf
ProxyPassReverse /swf https://${props.domainPrefix}.bloomingdales.fds.com:9443/swf
ProxyPass /checkoutswf https://${props.domainPrefix}.bloomingdales.fds.com:9644/checkoutswf
#ProxyPass /checkoutswf/checkout-webflow https://${props.domainPrefix}.bloomingdales.fds.com:9443/chkout/startcheckout

# credit
ProxyPass /credit https://${props.domainPrefix}.bloomingdales.fds.com:9644/credit
ProxyPass /img/ts https://macys-o.scene7.com
ProxyPass /chat.ognc https://${props.domainPrefix}.bloomingdales.fds.com:9644/chat.ognc

#creditservice
ProxyPass /creditservice https://${props.domainPrefix}.bloomingdales.fds.com:9443/creditservice
ProxyPass /creditservice/marketing/benefits https://${props.domainPrefix}.bloomingdales.fds.com:9443/creditservice/marketing/benefits

# misc pages
ProxyPass /international/shipping/supportedCountry http://${props.domainPrefix}.bloomingdales.fds.com:2202/international/shipping/supportedCountry
ProxyPass /internationalContext/index.ognc http://${props.domainPrefix}.bloomingdales.fds.com:2202/localepreference
ProxyPass /localepreference http://${props.domainPrefix}.bloomingdales.fds.com:2202/localepreference
ProxyPass /international/priceData http://${props.domainPrefix}.bloomingdales.fds.com:2202/international/priceData

#ProxyPass /signin https://${props.domainPrefix}.bloomingdales.fds.com:9644/signin
ProxyPass /myinfo https://${props.domainPrefix}.bloomingdales.fds.com:9644/myinfo
#ProxyPass /registry http://${props.domainPrefix}.bloomingdales.fds.com:9681/registry
#ProxyPass /service https://${props.domainPrefix}.bloomingdales.fds.com:9644/service

#requireJS
#ProxyPass /web20/assets/script/requirejs https://${props.domainPrefix}.bloomingdales.fds.com:9443/web20/assets/script/requirejs

#SNS
ProxyPass /signin/index.ognc https://${props.domainPrefix}.bloomingdales.fds.com:9443/account/signin
ProxyPass /account https://${props.domainPrefix}.bloomingdales.fds.com:9443/account
ProxyPass /chkout https://${props.domainPrefix}.bloomingdales.fds.com:9443/chkout
ProxyPass /sns https://${props.domainPrefix}.bloomingdales.fds.com:9443/sns
ProxyPass /myinfo https://${props.domainPrefix}.bloomingdales.fds.com:9644/myinfo
ProxyPass /service https://${props.domainPrefix}.bloomingdales.fds.com:9443/service
ProxyPass /formTest.jsp https://${props.domainPrefix}.bloomingdales.fds.com:9443/formTest.jsp
ProxyPass /registry https://${props.domainPrefix}.bloomingdales.fds.com:9443/registry
ProxyPass /accountweb https://${props.domainPrefix}.bloomingdales.fds.com:9443/accountweb

#Assets
ProxyPass /web20 http://${props.domainPrefix}.bloomingdales.fds.com:9876/web20
ProxyPass /web20 http://${props.domainPrefix}.bloomingdales.fds.com:2202/web20
ProxyPass /img http://${props.domainPrefix}.bloomingdales.fds.com:9876/img
ProxyPass /css http://${props.domainPrefix}.bloomingdales.fds.com:9876/css
ProxyPass /javascript http://${props.domainPrefix}.bloomingdales.fds.com:9876/javascript
ProxyPass /js http://${props.domainPrefix}.bloomingdales.fds.com:9876/js
ProxyPass /templates http://${props.domainPrefix}.bloomingdales.fds.com:9876/templates
ProxyPass /styles http://${props.domainPrefix}.bloomingdales.fds.com:9876/styles

#dyn_img
ProxyPass /navapp/dyn_img http://www.bloomingdales.com/dyn_img
ProxyPass /dyn_img https://www.bloomingdales.com/dyn_img

#ProxyPass /navapp/dyn_img http://${props.domainPrefix}.bloomingdales.fds.com/dyn_img
#ProxyPass /dyn_img https://${props.domainPrefix}.bloomingdales.fds.com:9443/dyn_img

#NavApp Assets
ProxyPass /navapp/js http://${props.domainPrefix}.bloomingdales.fds.com:2202/js
ProxyPass /navapp/templates http://${props.domainPrefix}.bloomingdales.fds.com:2202/templates
ProxyPass /navapp/styles http://${props.domainPrefix}.bloomingdales.fds.com:2202/styles
ProxyPass /navapp/web20/assets/img/walletDashboard http://${props.domainPrefix}.bloomingdales.fds.com:2202/web20/assets/img/walletDashboard
#ProxyPass /navapp/web20/assets/script/macys http://${props.domainPrefix}.bloomingdales.fds.com:9876/web20/assets/script/macys
ProxyPass /navapp/ http://${props.domainPrefix}.bloomingdales.fds.com:2202/

#SDP
#QA10
#ProxyPass /api http://11.168.42.145:8080/api
#QA15
ProxyPass /api http://www.qa15codebloomingdales.fds.com/api

#loyallist
ProxyPass /loyallist/benefits http://${props.domainPrefix}.bloomingdales.fds.com:9080/loyallist/benefits
ProxyPass /loyallist https://${props.domainPrefix}.bloomingdales.fds.com:9443/loyallist
ProxyPass /loyallist/enrollment https://${props.domainPrefix}.bloomingdales.fds.com:9443/loyallist/enrollment
ProxyPass /loyallist/accountsummary https://${props.domainPrefix}.bloomingdales.fds.com:9443/loyallist/accountsummary

#Mobile
ProxyPass /stylesheets https://${props.domainPrefix}.bloomingdales.fds.com:9876/stylesheets

#Informant Calls
ProxyPass /shop/catalog/product/recentlyPurchased/ https://jcia6748:8180/shop/catalog/product/recentlyPurchased/
ProxyPass /sdp/rto/record/customeraction https://jcia6748:8180/sdp/rto/record/customeraction
ProxyPass /sdp/rto/request/recommendations http://jcia6748:8180/sdp/rto/request/recommendations

#WSSG
ProxyPass /WebsiteServicesGateway http://${props.domainPrefix}.bloomingdales.fds.com:8585/WebsiteServicesGateway

#OES
ProxyPass /OES http://${props.domainPrefix}.bloomingdales.fds.com:9876/OES

# default all the rest here
#ProxyPass / http://${props.domainPrefix}.bloomingdales.fds.com:9681/

# default all the rest here
# ProxyPass / http://${props.domainPrefix}.bloomingdales.fds.com:8082/
# ProxyPass / http://${props.domainPrefix}.bloomingdales.fds.com:2202/

ProxyPassReverse /bag https://${props.domainPrefix}.bloomingdales.fds.com:2202/bag

ProxyPassReverse /signin/signout.ognc http://${props.domainPrefix}.bloomingdales.fds.com:2202/signin/signout.ognc
#ProxyPassReverse / http://${props.domainPrefix}.bloomingdales.fds.com:9681/
ProxyPassReverse / http://${props.domainPrefix}.bloomingdales.fds.com:2202/
`