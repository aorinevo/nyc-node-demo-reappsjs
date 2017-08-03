// Modifying this file?  Please make sure to support nginx too!

const envNameList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];

function compileVirtualHostBlock(envNumber, apacheRoot){
return `

#qa${envNumber}codebloomingdales
<VirtualHost *:443>    
    SSLEngine on
    SSLProxyEngine on 
    SSLProxyVerify none 
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    SSLProxyCheckPeerExpire off
    ProxyPreserveHost off   
    SSLCertificateFile "${apacheRoot}/cert/cert.crt"
    SSLCertificateKeyFile "${apacheRoot}/cert/cert.key" 
    ServerName local.secure-m.qa${envNumber}codebloomingdales.fds.com
    ServerAlias www.local.secure-m.qa${envNumber}codebloomingdales.fds.com
    ProxyPass /api https://secure-m.qa${envNumber}codebloomingdales.fds.com/api
    ProxyPass / https://127.0.0.1:8080/   
</VirtualHost>`;
}

module.exports = function( data ){
    var vhostFileContent = `# BCOM Virtual Hosts for MobileCustomerAppUI

    LoadModule ssl_module libexec/apache2/mod_ssl.so
    LoadModule vhost_alias_module libexec/apache2/mod_vhost_alias.so                     
    `;
    envNameList.forEach(item => {
        vhostFileContent += compileVirtualHostBlock(item,data.apacheRoot);
    });
    return vhostFileContent;
};