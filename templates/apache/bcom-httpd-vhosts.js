// Modifying this file?  Please make sure to support nginx too!
// ../nginx/bcom-server-blocks.js


module.exports = function( data ){
  return `# BCOM Virtual Hosts for polaris/credit-gateway, polaris/credit-preferences, SNS, NavApp, and MobileCustomerAppUI

LoadModule ssl_module libexec/apache2/mod_ssl.so
LoadModule vhost_alias_module libexec/apache2/mod_vhost_alias.so

Listen 443

<VirtualHost *:443>    
    SSLEngine on  
    SSLProxyEngine on 
    SSLProxyVerify none 
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    SSLProxyCheckPeerExpire off
    ProxyPreserveHost off        
    SSLCertificateFile "${data.apacheRoot}/cert/server.crt"
    SSLCertificateKeyFile "${data.apacheRoot}/cert/server.key"
    ServerName ${data.domainPrefix}.bloomingdales.fds.com
    ServerAlias www.${data.domainPrefix}.bloomingdales.fds.com

    # Scene7 (Page titles for pages like Sign In page)
    ProxyPass /img/ts https://macys-o.scene7.com
    
    # Polaris pages
    ProxyPass /xapi https://www.${data.envName}.fds.com/xapi
    ProxyPass /img http://www.${data.envName}.fds.com/img
    ProxyPass /my-credit http://${data.domainPrefix}.bloomingdales.fds.com:${data.ports.creditGateway}/my-credit
    ProxyPass /feature/credit-gateway http://${data.domainPrefix}.bloomingdales.fds.com:${data.ports.creditGateway}/feature/credit-gateway
    ProxyPass /assets http://${data.domainPrefix}.bloomingdales.fds.com:${data.ports.creditGateway}/assets
    ProxyPass /static http://${data.domainPrefix}.bloomingdales.fds.com:${data.ports.creditGateway}/static
    ProxyPass /account/preferences http://${data.domainPrefix}.bloomingdales.fds.com:${data.ports.customerPreferences}/account/preferences
    ProxyPass /page/customer-preferences http://${data.domainPrefix}.bloomingdales.fds.com:${data.ports.customerPreferences}/page/customer-preferences
    
    #Ajax
    ProxyPass /creditservice/respgateway https://www.${data.envName}.fds.com/creditservice/respgateway

    # SNS Assets
    ProxyPass /sns/signin/index.ognc https://${data.domainPrefix}.bloomingdales.fds.com:9443/account/signin
    ProxyPass /web20/assets/script/yahoo/3.8.1/yui/yui.js https://${data.domainPrefix}.bloomingdales.fds.com:9443/web20/assets/script/yahoo/3.8.1/yui/yui.js
    ProxyPass /sns/web20/assets https://${data.domainPrefix}.bloomingdales.fds.com:9443/sns/web20/assets
    ProxyPass /sns/web20 https://${data.domainPrefix}.bloomingdales.fds.com:9443/web20
    ProxyPass /sns/styles https://${data.domainPrefix}.bloomingdales.fds.com:9443/styles
    ProxyPass /sns/js https://${data.domainPrefix}.bloomingdales.fds.com:9443/js
    ProxyPass /sns/dyn_img https://www.bloomingdales.com/dyn_img
    ProxyPass /sns/javascript https://${data.domainPrefix}.bloomingdales.fds.com:9443/javascript
    ProxyPass /sns/img http://${data.domainPrefix}.bloomingdales.fds.com:9876/img
    ProxyPass /sns/ https://${data.domainPrefix}.bloomingdales.fds.com:9443/
    
    # SNS Pages
    ProxyPass /account https://${data.domainPrefix}.bloomingdales.fds.com:9443/account
    ProxyPass /service https://${data.domainPrefix}.bloomingdales.fds.com:9443/service
    ProxyPass /creditservice https://${data.domainPrefix}.bloomingdales.fds.com:9443/creditservice
    ProxyPass /loyallist/benefits http://${data.domainPrefix}.bloomingdales.fds.com:9080/loyallist/benefits
    ProxyPass /loyallist https://${data.domainPrefix}.bloomingdales.fds.com:9443/loyallist
    ProxyPass /chkout https://${data.domainPrefix}.bloomingdales.fds.com:9443/chkout
    ProxyPass /wedding-registry https://${data.domainPrefix}.bloomingdales.fds.com:9443/wedding-registry/
    ProxyPass /registry https://${data.domainPrefix}.bloomingdales.fds.com:9443/registry

    # NavApp Assets
    ProxyPass /navapp/web20/assets http://${data.domainPrefix}.bloomingdales.fds.com:2202/web20/assets
    ProxyPass /navapp/web20 http://${data.domainPrefix}.bloomingdales.fds.com:2202/web20
    ProxyPass /navapp/css http://${data.domainPrefix}.bloomingdales.fds.com:2202/css
    ProxyPass /navapp/styles http://${data.domainPrefix}.bloomingdales.fds.com:2202/styles
    ProxyPass /navapp/js http://${data.domainPrefix}.bloomingdales.fds.com:2202/js
    ProxyPass /navapp/dyn_img http://www.bloomingdales.com/dyn_img
    ProxyPass /navapp/javascript http://${data.domainPrefix}.bloomingdales.fds.com:2202/javascript
    ProxyPass /navapp/img http://${data.domainPrefix}.bloomingdales.fds.com:9876/img
    ProxyPass /navapp/ http://${data.domainPrefix}.bloomingdales.fds.com:2202/
    
    # NavApp Pages
    ProxyPass /international http://${data.domainPrefix}.bloomingdales.fds.com:2202/international
    ProxyPass /bag http://${data.domainPrefix}.bloomingdales.fds.com:2202/bag

    ProxyPass /dyn_img http://www.bloomingdales.com/dyn_img

    # BloomiesAssets
    ProxyPass /js http://${data.domainPrefix}.bloomingdales.fds.com:9876/js
    ProxyPass /javascript http://${data.domainPrefix}.bloomingdales.fds.com:9876/javascript
    ProxyPass /templates http://${data.domainPrefix}.bloomingdales.fds.com:9876/templates
    ProxyPass /styles http://${data.domainPrefix}.bloomingdales.fds.com:9876/styles
    ProxyPass /img http://${data.domainPrefix}.bloomingdales.fds.com:9876/img
    ProxyPass /web20 http://${data.domainPrefix}.bloomingdales.fds.com:9876/web20

    # FOBs Redirect
    ProxyPass /catalog/index.ognc http://${data.domainPrefix}.bloomingdales.fds.com:2202/catalog/index.ognc
    
    # Header data
    ProxyPass /shop http://${data.domainPrefix}.bloomingdales.fds.com:2202/shop
    
    ProxyPass /index.jsp https://${data.domainPrefix}.bloomingdales.fds.com:9443/index.jsp

    #checkout
    ProxyPassReverse /swf https://${data.domainPrefix}.bloomingdales.fds.com:2202/swf
    ProxyPassReverse /swf https://${data.domainPrefix}.bloomingdales.fds.com:9443/swf
    #ProxyPass /checkoutswf/checkout-webflow https://${data.domainPrefix}.bloomingdales.fds.com:9443/chkout/startcheckout

    ProxyPass /api http://www.${data.envName}.fds.com/api

    #Informant Calls
    ProxyPass /shop/catalog/product/recentlyPurchased/ https://www.${data.envName}.fds.com:8180/shop/catalog/product/recentlyPurchased/
    ProxyPass /sdp/rto/record/customeraction https://www.${data.envName}.fds.com:8180/sdp/rto/record/customeraction
    ProxyPass /sdp/rto/request/recommendations http://www.${data.envName}.fds.com:8180/sdp/rto/request/recommendations

    #ProxyPassReverse /bag https://${data.domainPrefix}.bloomingdales.fds.com:2202/bag

    ProxyPassReverse /signin/signout.ognc http://${data.domainPrefix}.bloomingdales.fds.com:2202/signin/signout.ognc   
</VirtualHost>  

<VirtualHost *:443>    
    SSLEngine on
    SSLProxyEngine on 
    SSLProxyVerify none 
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    SSLProxyCheckPeerExpire off
    ProxyPreserveHost off   
    SSLCertificateFile "${data.apacheRoot}/cert/cert.crt"
    SSLCertificateKeyFile "${data.apacheRoot}/cert/cert.key" 
    ServerName local.secure-m.${data.envName}.fds.com
    ServerAlias www.local.secure-m.${data.envName}.fds.com
    ProxyPass /api https://secure-m.${data.envName}.fds.com/api
    ProxyPass / https://127.0.0.1:8080/   
</VirtualHost>                               
`;
};