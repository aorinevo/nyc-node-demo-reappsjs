// Modifying this file?  Please make sure to support nginx too!
// ../apache/httpd-vhosts.js

module.exports = function( data ){
  return `server {
    listen 443;
    server_name ${data.domainPrefix}.bloomingdales.fds.com;
    ssl on;
    ssl_certificate ${data.nginxRoot}/cert/server.crt;
    ssl_certificate_key ${data.nginxRoot}/cert/server.key;
    
    # SNS Assets
    location /sns/signin/index.ognc {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/account/signin;
    }
    location /web20/assets/script/yahoo/3.8.1/yui/yui.js {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/web20/assets/script/yahoo/3.8.1/yui/yui.js;
    }
    location /sns/web20/assets {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/sns/web20/assets;
    }
    location /sns/web20 {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/web20;
    }
    location /sns/styles {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/styles;
    }
    location /sns/js {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/js;
    }
    location /sns/dyn_img {
      proxy_pass https://www.bloomingdales.com/dyn_img;
    }
    location /sns/javascript {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/javascript;
    }
    location /sns/img {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:9876/img;
    }
    location /sns/ {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/;
    }  
    
    # SNS Pages
    location /account {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/account;
    }
    location /creditservice {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/creditservice;
    }
    location /loyallist/benefits {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:9080/loyallist/benefits;
    }
    location /loyallist {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/loyallist;
    }
    location /chkout {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/chkout;
    }
    location /registry/ {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/registry
    }
    location /wedding-registry {
      proxy_pass https://${data.domainPrefix}.{data.envName}.fds.com/wedding-registry
    }
    # NavApp Assets
    location /navapp/web20/assets {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:2202/web20/assets;
    }
    location /navapp/web20 {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:2202/web20;
    }
    location /navapp/css {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:2202/css;
    }
    location /navapp/styles {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:2202/styles;
    }
    location /navapp/js {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:2202/js;
    }
    location /navapp/dyn_img {
      proxy_pass http://www.bloomingdales.com/dyn_img;
    }
    location /navapp/javascript {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:2202/javascript;
    }
    location /navapp/img {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:9876/img;
    }
    location /navapp/ {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:2202/;
    }
    
    # NavApp Pages
    location /international {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:2202/international;
    }
    location /bag {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:2202/bag;
    }

    location /dyn_img {
      proxy_pass http://www.bloomingdales.com/dyn_img;
    }

    # BloomiesAssets
    location /js {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:9876/js;
    }
    location /javascript {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:9876/javascript;
    }
    location /templates {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:9876/templates;
    }
    location /styles {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:9876/styles;
    }
    location /img {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:9876/img;
    }
    location /web20 {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:9876/web20    ;
    }
    
    # FOBs Redirect
    location /catalog/index.ognc {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:2202/catalog/index.ognc;
    }
    
    # Header data
    location /shop {
      proxy_pass http://${data.domainPrefix}.bloomingdales.fds.com:2202/shop;
    }
    
    location /index.jsp {
      proxy_pass https://${data.domainPrefix}.bloomingdales.fds.com:9443/index.jsp;
    }

    location /api {
      proxy_pass http://www.${data.envName}.fds.com/api;
    }

    # Informant Calls
    location /shop/catalog/product/recentlyPurchased/ {
      proxy_pass https://www.${data.envName}.fds.com:8180/shop/catalog/product/recentlyPurchased/;
    }
    location /sdp/rto/record/customeraction {
      proxy_pass https://www.${data.envName}.fds.com:8180/sdp/rto/record/customeraction;
    }
    location /sdp/rto/request/recommendations {
      proxy_pass http://www.${data.envName}.fds.com:8180/sdp/rto/request/recommendations;
    }   
  }
  
  server {
    listen 443;
    server_name ~^local\.secure\-m\.qa(?<serverId>[\d]+)code(?<brand>macys|bloomingdales)\.fds\.com$;

    #access_log ${data.nginxRoot}/logs/access.log;
    #error_log ${data.nginxRoot}/logs/error.log;

    ssl on;
	  ssl_certificate ${data.nginxRoot}/cert/cert.crt;
	  ssl_certificate_key ${data.nginxRoot}/cert/cert.key;

    location /api {
      resolver 8.8.8.8;
      set $targetUrl https://secure-m.qa\${serverId}code\${brand}.fds.com;
      add_header X-Target-Url $targetUrl;
      proxy_pass $targetUrl;
    }

    location / {
      proxy_pass http://localhost:8080;
    }

    location /api/v1/wallet/summary {
      proxy_pass http://localhost:8080/;
    }
  }
  `;
};