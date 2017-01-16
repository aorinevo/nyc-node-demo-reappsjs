var fs = require('fs'),
    winston = require( 'winston'),
    shell = require('shelljs'),
    props = require('./reapps-properties.json'),
    argv = require('yargs').argv,
    secureMCrt = `-----BEGIN CERTIFICATE-----
MIIMdjCCCt6gAwIBAgIJAN04hT4LHwRNMA0GCSqGSIb3DQEBCwUAMIGuMQswCQYD
VQQGEwJCUjEVMBMGA1UECBMMTWluYXMgR2VyYWlzMRcwFQYDVQQHEw5CZWxvIEhv
cml6b250ZTEhMB8GA1UEChMYTFNDb2RlciBDb25zdWx0b3JpYSBMdGRhMQswCQYD
VQQLEwJJVDEXMBUGA1UEAxMObHNjb2Rlci5jb20uYnIxJjAkBgkqhkiG9w0BCQEW
F2xlb25hcmRvQGxzY29kZXIuY29tLmJyMB4XDTE1MDQwOTAyMjY1NVoXDTE3MDQw
ODAyMjY1NVowga4xCzAJBgNVBAYTAkJSMRUwEwYDVQQIEwxNaW5hcyBHZXJhaXMx
FzAVBgNVBAcTDkJlbG8gSG9yaXpvbnRlMSEwHwYDVQQKExhMU0NvZGVyIENvbnN1
bHRvcmlhIEx0ZGExCzAJBgNVBAsTAklUMRcwFQYDVQQDEw5sc2NvZGVyLmNvbS5i
cjEmMCQGCSqGSIb3DQEJARYXbGVvbmFyZG9AbHNjb2Rlci5jb20uYnIwggGiMA0G
CSqGSIb3DQEBAQUAA4IBjwAwggGKAoIBgQDPF8tkMTmFi3trPoJdXAQlLiU7uiiQ
1tjUi5miO/o8/Dwr5K/mylb1+sZPIVzB0KtIHOhpfdDAR8C4PeDGQioZJRSOMggs
vBCAlEwNRBQqyWR2R5Y4WdWP+CSLUtT/7R5B0iJZ6hWFgn6LeHlGZRduz5mDg277
3TuufSthBzK4bioZTyLOHPWf8PxCl4YzkeRWgS7kbhyEs8TthnUJM2SVH1T8oOZp
M0kSF0Z/E9J7dEcPRA64dej5N4H5WoZ/O2MlIqPpwlDQ+GecP8EnJPcDyYB+Ad4Z
x8u/jWffShvOgfAeTl+0N8UCytKKRl6dk5IMZcNFhRo8OLoCkICFMNyn12JmuwzV
S7QGYFIgRccgiwwa0kwILJm6003upjpZk6fHIakYqd9B3PSKPIG5mas6qZUu7EsW
s+VlyGwjjzH2YRkcJP1DTupjTIWksNU0UkX0n1PcrtejHIKwCNGVwLgPOGJBYmrU
M6FPv63xBSDzVjK3mS1BclLbvfJUlMXZ7qkCAwEAAaOCB5MwggePMB0GA1UdDgQW
BBRps2aPYMjS9u4EsZFmF1QHfDZVzzCB4wYDVR0jBIHbMIHYgBRps2aPYMjS9u4E
sZFmF1QHfDZVz6GBtKSBsTCBrjELMAkGA1UEBhMCQlIxFTATBgNVBAgTDE1pbmFz
IEdlcmFpczEXMBUGA1UEBxMOQmVsbyBIb3Jpem9udGUxITAfBgNVBAoTGExTQ29k
ZXIgQ29uc3VsdG9yaWEgTHRkYTELMAkGA1UECxMCSVQxFzAVBgNVBAMTDmxzY29k
ZXIuY29tLmJyMSYwJAYJKoZIhvcNAQkBFhdsZW9uYXJkb0Bsc2NvZGVyLmNvbS5i
coIJAN04hT4LHwRNMAwGA1UdEwQFMAMBAf8wCwYDVR0PBAQDAgWgMIIGawYDVR0R
BIIGYjCCBl6CCSouZmRzLmNvbYIeKi5xYTZjb2RlYmxvb21pbmdkYWxlcy5mZHMu
Y29tgh4qLnFhN2NvZGVibG9vbWluZ2RhbGVzLmZkcy5jb22CHioucWE4Y29kZWJs
b29taW5nZGFsZXMuZmRzLmNvbYIeKi5xYTljb2RlYmxvb21pbmdkYWxlcy5mZHMu
Y29tgh8qLnFhMTBjb2RlYmxvb21pbmdkYWxlcy5mZHMuY29tgh8qLnFhMTFjb2Rl
Ymxvb21pbmdkYWxlcy5mZHMuY29tgh8qLnFhMTJjb2RlYmxvb21pbmdkYWxlcy5m
ZHMuY29tgh8qLnFhMTNjb2RlYmxvb21pbmdkYWxlcy5mZHMuY29tgh8qLnFhMTRj
b2RlYmxvb21pbmdkYWxlcy5mZHMuY29tgh8qLnFhMTVjb2RlYmxvb21pbmdkYWxl
cy5mZHMuY29tgicqLnNlY3VyZS1tLnFhNmNvZGVibG9vbWluZ2RhbGVzLmZkcy5j
b22CJyouc2VjdXJlLW0ucWE3Y29kZWJsb29taW5nZGFsZXMuZmRzLmNvbYInKi5z
ZWN1cmUtbS5xYThjb2RlYmxvb21pbmdkYWxlcy5mZHMuY29tgicqLnNlY3VyZS1t
LnFhOWNvZGVibG9vbWluZ2RhbGVzLmZkcy5jb22CKCouc2VjdXJlLW0ucWExMGNv
ZGVibG9vbWluZ2RhbGVzLmZkcy5jb22CKCouc2VjdXJlLW0ucWExMWNvZGVibG9v
bWluZ2RhbGVzLmZkcy5jb22CKCouc2VjdXJlLW0ucWExMmNvZGVibG9vbWluZ2Rh
bGVzLmZkcy5jb22CKCouc2VjdXJlLW0ucWExM2NvZGVibG9vbWluZ2RhbGVzLmZk
cy5jb22CKCouc2VjdXJlLW0ucWExNGNvZGVibG9vbWluZ2RhbGVzLmZkcy5jb22C
KCouc2VjdXJlLW0ucWExNWNvZGVibG9vbWluZ2RhbGVzLmZkcy5jb22CFioucWE2
Y29kZW1hY3lzLmZkcy5jb22CFioucWE3Y29kZW1hY3lzLmZkcy5jb22CFioucWE4
Y29kZW1hY3lzLmZkcy5jb22CFioucWE5Y29kZW1hY3lzLmZkcy5jb22CFyoucWEx
MGNvZGVtYWN5cy5mZHMuY29tghcqLnFhMTFjb2RlbWFjeXMuZmRzLmNvbYIXKi5x
YTEyY29kZW1hY3lzLmZkcy5jb22CFyoucWExM2NvZGVtYWN5cy5mZHMuY29tghcq
LnFhMTRjb2RlbWFjeXMuZmRzLmNvbYIXKi5xYTE1Y29kZW1hY3lzLmZkcy5jb22C
FyoucWExNmNvZGVtYWN5cy5mZHMuY29tghcqLnFhMTdjb2RlbWFjeXMuZmRzLmNv
bYIXKi5xYTE4Y29kZW1hY3lzLmZkcy5jb22CFyoucWExOWNvZGVtYWN5cy5mZHMu
Y29tghcqLnFhMjBjb2RlbWFjeXMuZmRzLmNvbYIfKi5zZWN1cmUtbS5xYTZjb2Rl
bWFjeXMuZmRzLmNvbYIfKi5zZWN1cmUtbS5xYTdjb2RlbWFjeXMuZmRzLmNvbYIf
Ki5zZWN1cmUtbS5xYThjb2RlbWFjeXMuZmRzLmNvbYIfKi5zZWN1cmUtbS5xYTlj
b2RlbWFjeXMuZmRzLmNvbYIgKi5zZWN1cmUtbS5xYTEwY29kZW1hY3lzLmZkcy5j
b22CICouc2VjdXJlLW0ucWExMWNvZGVtYWN5cy5mZHMuY29tgiAqLnNlY3VyZS1t
LnFhMTJjb2RlbWFjeXMuZmRzLmNvbYIgKi5zZWN1cmUtbS5xYTEzY29kZW1hY3lz
LmZkcy5jb22CICouc2VjdXJlLW0ucWExNGNvZGVtYWN5cy5mZHMuY29tgiAqLnNl
Y3VyZS1tLnFhMTVjb2RlbWFjeXMuZmRzLmNvbYIgKi5zZWN1cmUtbS5xYTE2Y29k
ZW1hY3lzLmZkcy5jb22CICouc2VjdXJlLW0ucWExN2NvZGVtYWN5cy5mZHMuY29t
giAqLnNlY3VyZS1tLnFhMThjb2RlbWFjeXMuZmRzLmNvbYIgKi5zZWN1cmUtbS5x
YTE5Y29kZW1hY3lzLmZkcy5jb22CICouc2VjdXJlLW0ucWEyMGNvZGVtYWN5cy5m
ZHMuY29tMA0GCSqGSIb3DQEBCwUAA4IBgQBk3g4x5jFepL7TN169bu+2xJzsuMnJ
fyqMME7WJewM/cRRH+aXwjVkTqDVIK27WqI/sn3McDizmaX+9VyZEqguDn2elkRU
a/0Kku1mkSGLOE2moz2JN9H/erQ2QbQgz//q/fQMgvXcVEffwOxKmIM5hm9Z/ybm
8gVVuvJ+rPI1sdF/x7E5J/JEIWTNMjzWhpTb+8nzC31G0jMyaYpisfdNj/rqOPpD
+GpkV2G0ePYanvFE8gHbZXldRJdlUvoi+e6eMCPEOnNql4XSasOdo0RGmLEYCPIA
ivapjejY2py3WVCE4OGlUnu+pokFDXfVFHldipxCTrLTgxV/iPVhR+m7L1sLg0NE
sGRb8MV3ve8ed5PSqZTxERiumU2ctSieeqwubhvvDwwTeLQOoM6mF51wGSVbEXIP
Ipm6te2sAoTR2DMCMjJhOm0FDrN4hwAuvYlGYuLXx7IU5Wrv4ATKPRd3UXJIHhB/
y6v77hJ9Y6czAt6Jw9DDlrUm0Zb1Sh4Eb3U=
-----END CERTIFICATE-----`,
  secureMKey = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`,
  snsNavAppCrt = `-----BEGIN CERTIFICATE-----
MIICATCCAWoCCQCXB431Efi14DANBgkqhkiG9w0BAQUFADBFMQswCQYDVQQGEwJB
VTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0
cyBQdHkgTHRkMB4XDTE0MDUwODE2MjYwNloXDTQyMDkyMzE2MjYwNlowRTELMAkG
A1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoMGEludGVybmV0
IFdpZGdpdHMgUHR5IEx0ZDCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA6RN0
ohEr4uenq+68TotTGs5rZbo/oCBesW+fiey7pMLs41fgOFu+h73UBXTJUfAx6AI+
OQiXLlcB+tdeSesmvtfTMxPSSCdyoJkCjnGgeNhGhCqv/EaZ5tJqzJeFSd+RKTvg
+BnuCkWKwEY1T6F0Sw3gVUCK3S5r3Gza7zeMNBcCAwEAATANBgkqhkiG9w0BAQUF
AAOBgQDAnJlQShD1aSgsJHJUaeCsE2qoy7QO8sOu/3s0b08iPr84PCasLln9qyDu
/RnJIOu9k23zjr9lz6CRozYzS84q4z60SS5gMTyqMakGF42h9lRUeUjbh5198N/A
WxiRdACFqxcAa+EsdVVWQVdPU3iAOPIFsslGi6ln5qx4jjiBEA==
-----END CERTIFICATE-----`,
  snsNavAppKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQDpE3SiESvi56er7rxOi1Mazmtluj+gIF6xb5+J7LukwuzjV+A4
W76HvdQFdMlR8DHoAj45CJcuVwH6115J6ya+19MzE9JIJ3KgmQKOcaB42EaEKq/8
Rpnm0mrMl4VJ35EpO+D4Ge4KRYrARjVPoXRLDeBVQIrdLmvcbNrvN4w0FwIDAQAB
AoGAEPI+L65p73SCZ2jTPi65GyDZBCt3hs/zspj4E5InzoHxsVHpVo+tGbd+m+ry
3EdHiaPoHEN4ooDm/vL7wwoa5e/KxtHDOsEheDM4eoZLYXDtU6n5fSdqVNDEhaRu
LeZCcp/yjEG1H0tkeEOt6vLHwGIYJPFpU6vyxaBtPmrpLkkCQQD4QrL2BG6m7pdP
9XY8sbbjvHSHQW1/5dA/k+yL6m4uWn+WUYfzBPRwT7UQt3NwimXtQS4LqS+631w2
ZMPH5hPLAkEA8FeSn2Lor9XlQKIyAcqdZ9iFjHuo5Eeol9FRyKxNFRHeAeeJSBec
cLlDLrZmHpwJ4jfx/Sd2Qsvdk4U4lyiPZQJAczMoLibyXb37MtxZSGLC1jyd6iF/
OUkf8FCpBGf9Rr8x00P0DN3wu6kRATfPdpqSH50OS9TvVAzPkmIBw2HNLwJBAKOi
PAWgheQRsUBMLdfiZ0DoviRjnR2vXC3hKdmC1gheXdTWGzWmPbDRsdf//48flesb
Q/qj/3SC8J0buufPibECQHmAwz2BY/g+F096cUCbaLkzYACIzCIVnKlRRhXJuRuB
+jvBOsM1ANIHQFPkjNgYLN3h29PSH5NHt/U0+JUcV+4=
-----END RSA PRIVATE KEY-----`,
navAppBcom = `server {
  listen 80;
  server_name ${props.domainPrefix}.bloomingdales.fds.com;
  #error_log /usr/local/etc/nginx/log/navapp.log debug;

  location /wgl-api/{
    proxy_pass http://www1.qa10codebloomingdales.fds.com/wgl-api/;
  }

  location /js/min/bcom/base/{
    proxy_pass http://localhost:8234/target/classes/js/bcom/base/;
  }

  location /js/bcom/base/{
    proxy_pass http://localhost:8234/target/classes/js/bcom/base/;
  }

  location /js/min/vendor/ {
    proxy_pass http://localhost:8234/vendor/;
  }

  location /js/vendor/ {
    proxy_pass http://localhost:8234/vendor/;
  }

  location /js/min/ {
    proxy_pass http://localhost:8234/src/;
  }

  location /js/ {
    proxy_pass http://localhost:8234/src/;
  }

  location /styles/min/ {
    proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:2202/styles/min;
  }

  location /styles/ {
    proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:2202/styles;
  }

  location /templates/min/ {
    proxy_pass http://localhost:8234/templates/;
  }

  location /templates/ {
    proxy_pass http://localhost:8234/templates/;
  }

  location /navapp/web20/assets/ {
    proxy_pass http://www1.qa10codebloomingdales.fds.com/navapp/web20/assets/;
  }

  location /dyn_img/ {
    proxy_pass http://www1.qa10codebloomingdales.fds.com/dyn_img/;
  }

  location /img/ {
    proxy_pass http://www1.qa10codebloomingdales.fds.com/img/;
  }

  location /images/ {
    proxy_pass http://www1.qa10codebloomingdales.fds.com/images/;
  }

  location /EventsWar/ {
    #proxy_pass http://jcia8871:8280/EventsWar/;
    proxy_pass http://www1.qa10codebloomingdales.fds.com/EventsWar/;
  }

  location / {
    proxy_pass  http://${props.domainPrefix}.bloomingdales.fds.com:2202/;
  }

  location /shop {
    proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:2202/shop;
  }
}
`,
secureM = `server {
    listen 443;
    server_name ~^local\.secure\-m\.qa(?<serverId>[\d]+)code(?<brand>macys|bloomingdales)\.fds\.com$;

    #access_log /usr/local/etc/nginx/logs/access.log;
    #error_log /usr/local/etc/nginx/logs/error.log;

    ssl on;
	  ssl_certificate /usr/local/etc/nginx/cert/cert.crt;
	  ssl_certificate_key /usr/local/etc/nginx/cert/cert.key;

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
}`,
shopAppBcom = `server {
 listen 443;
 server_name ${props.domainPrefix}.bloomingdales.fds.com;
 ssl on;
 ssl_certificate /usr/local/etc/nginx/cert/server.crt;
 ssl_certificate_key /usr/local/etc/nginx/cert/server.key;

 #extras
 location /shop/topnav {
   proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:2202/shop/topnav;
 }

 location navapp/dyn_img {
   proxy_pass http://www.bloomingdales.com;
 }

 location /dyn_img {
   proxy_pass https://www.bloomingdales.com/dyn_img;
 }

 #location navapp/dyn_img/ {
 #  proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:2202/dyn_img;
 #}

 #location /dyn_img/ {
 #  proxy_pass https://${props.domainPrefix}.bloomingdales.fds.com:9443/dyn_img;
 #}

 location  /img/ts {
  proxy_pass https://macys-o.scene7.com;
 }

 location /shop {
   proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:2202/shop;
 }
 location /web20/assets/script/yahoo/3.8.1/yui/yui.js {
   proxy_pass https://www.bcomexternal123.fds.com/web20/assets/script/yahoo/3.8.1/yui/yui.js;
 }

 #assets
 location /web20 {
   proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:2202/web20;
 }
 location /img {
   proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:9876/img;
 }
 location /css {
   proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:9876/css;
 }
 location /javascript {
   proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:9876/javascript;
 }
 location /js {
   proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:9876/js;
 }
 location /templates {
   proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:9876/templates;
 }
 location /styles {
   proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:9876/styles;
 }

 #loyallist
 location /loyallist {
   proxy_pass https://${props.domainPrefix}.bloomingdales.fds.com:9443/loyallist;
 }
 location /loyallist/benefits {
   proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:9080/loyallist/benefits;
 }
 location /loyallist/enrollment {
   proxy_pass https://${props.domainPrefix}.bloomingdales.fds.com:9443/loyallist/enrollment;
 }
 location /loyallist/accountsummary {
   proxy_pass https://${props.domainPrefix}.bloomingdales.fds.com:9443/loyallist/accountsummary;
 }
 location /livereload.js {
     proxy_pass http://${props.domainPrefix}.bloomingdales.fds.com:35729/livereload.js;
 }

 #### MOCKS ####
 location /test {
   proxy_pass http://localhost:9876/test;
 }

 #location /chkout/async/order {
    #proxy_pass http://localhost:9876/test/jasmine-2/json/bcom/features/repayment/signedIn/RepaymentOneItem.json;
    #proxy_pass http://localhost:9876/test/jasmine-2/json/bcom/features/repayment/guest/Repayment.json;
 #}
 #### /MOCKS ####

 location / {
   proxy_pass https://${props.domainPrefix}.bloomingdales.fds.com:9443/;
 }
}`,
virtualHosts = `# Virtual Hosts
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

<VirtualHost *:80>    
    ServerName ${props.domainPrefix}.bloomingdales.fds.com
    ServerAlias www.${props.domainPrefix}.bloomingdales.fds.com
    
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

    #Assets
    ProxyPass /web20 http://${props.domainPrefix}.bloomingdales.fds.com:2202/web20
    ProxyPass /web20 http://${props.domainPrefix}.bloomingdales.fds.com:9876/web20
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
    SSLCertificateFile "/private/etc/apache2/cert/server.crt"
    SSLCertificateKeyFile "/private/etc/apache2/cert/server.key"    
</VirtualHost>

<VirtualHost *:443>    
    ServerName ${props.domainPrefix}.bloomingdales.fds.com
    ServerAlias www.${props.domainPrefix}.bloomingdales.fds.com
    
    ProxyPass /shop http://${props.domainPrefix}.bloomingdales.fds.com:2202/shop
    
    ProxyPass /index.jsp https://${props.domainPrefix}.bloomingdales.fds.com:9443/index.jsp

    # registry pages
    ProxyPass /registry/wedding/registryhome https://${props.domainPrefix}.bloomingdales.fds.com:9443/registry/wedding/registryhome

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
    ProxyPass /web20 http://${props.domainPrefix}.bloomingdales.fds.com:2202/web20
    ProxyPass /web20 http://${props.domainPrefix}.bloomingdales.fds.com:9876/web20
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

    ProxyPassReverse /bag https://${props.domainPrefix}.bloomingdales.fds.com:2202/bag

    ProxyPassReverse /signin/signout.ognc http://${props.domainPrefix}.bloomingdales.fds.com:2202/signin/signout.ognc
    #ProxyPassReverse / http://${props.domainPrefix}.bloomingdales.fds.com:9681/
    ProxyPassReverse / http://${props.domainPrefix}.bloomingdales.fds.com:2202/
    SSLEngine on  
    SSLProxyEngine on 
    SSLProxyVerify none 
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    SSLProxyCheckPeerExpire off
    ProxyPreserveHost off        
    SSLCertificateFile "/private/etc/apache2/cert/server.crt"
    SSLCertificateKeyFile "/private/etc/apache2/cert/server.key"    
</VirtualHost>  

<VirtualHost *:443>    
    ServerName local.secure-m.qa13codebloomingdales.fds.com
    ServerAlias www.local.secure-m.qa13codebloomingdales.fds.com
    ProxyPass /api http://secure-m.qa13codebloomingdales.fds.com/api
    ProxyPass / http://127.0.0.1:8080/
    SSLEngine on   
    SSLCertificateFile "/private/etc/apache2/cert/cert.crt"
    SSLCertificateKeyFile "/private/etc/apache2/cert/cert.key"    
</VirtualHost>`,
  certificates = {
    cert: {
      crt: secureMCrt,
      key: secureMKey
    },
    server: {
      crt: snsNavAppCrt,
      key: snsNavAppKey
    }
  },
  serverBlocks = {
    nginx: {
      navAppBcom: navAppBcom,
      secureM: secureM,
      shopAppBcom: shopAppBcom 
    },
    apache2: {
      "httpd-vhosts": virtualHosts,
    }
  };

function updateCertOrKey( proxyServer, certFileName, extension ){  
  if( !fs.existsSync( `${proxyServer.path}/cert` ) ){
    shell.exec(`sudo mkdir ${proxyServer.path}/cert` );
  }
  if( !fs.existsSync(`${proxyServer.path}/cert/${certFileName}.${extension}`) || argv.force ){
    fs.writeFile( `./${certFileName}.${extension}`, certificates[certFileName][extension], 'utf8', function (err) {
        if (err) {
         winston.log('error', err);
         return false;
        }
        shell.exec(`sudo mv ./${certFileName}.${extension} ${proxyServer.path}/cert/${certFileName}.${extension}` );
       winston.log( 'info', `${certFileName}.${extension} file created in ${proxyServer.path}/cert/` );
       if( proxyServer.name === 'apache24' ){
        shell.exec('sudo apachectl restart');
       } else {
        shell.exec('sudo nginx -s stop');
        shell.exec('sudo nginx');
       }
       
       winston.log( 'info', `restarted ${proxyServer.name}`);
    });
  } else {
    winston.log( 'info', `/etc/apache2/cert/${certFileName}.${extension} already exists.`);
    winston.log( 'info', `To overwrite file(s), use --force`);
  }
}

function updateServerBlocks( proxyServer, fileName, extension ){
  var pathToServerBlocksFile = `${proxyServer.path}/servers/${fileName}.${extension}`;
  if( !fs.existsSync( `${proxyServer.path}/servers` ) ){
    shell.exec(`sudo mkdir ${proxyServer.path}/servers` );
  }
  if( !fs.existsSync(pathToServerBlocksFile) || argv.force ){
    fs.writeFile( `./${fileName}.${extension}`, serverBlocks[proxyServer.name][fileName], 'utf8', function (err) {
        if (err) {
         winston.log('error', err);
         return false;
        }
        shell.exec(`sudo mv ./${fileName}.${extension} ${pathToServerBlocksFile}` );
       winston.log( 'info', `created ${pathToServerBlocksFile}` );
       if( proxyServer.name === 'apache24' ){
        shell.exec('sudo apachectl restart');
       } else {
        shell.exec('sudo nginx -s stop');
        shell.exec('sudo nginx');
       }
       
       winston.log( 'info', `restarted ${proxyServer.name}`);
    });
  } else {
    winston.log( 'info', `${pathToServerBlocksFile} already exists.`);
    winston.log( 'info', `To overwrite file(s), use --force`);
  }
}

module.exports = {
  updateCertOrKey: updateCertOrKey,
  updateServerBlocks: updateServerBlocks,
  updateVirtualHosts: updateServerBlocks
};