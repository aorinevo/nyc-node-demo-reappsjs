## Introduction
Reapps.js is an NPM module that automates parts of the NavApp, ShopApp, BloomiesAssets, and MobileCustomerAppUI (secure-m) set-up process. Checkout the Basic Usage section for an example use case.

| Automation      | Status   |
|-----------------|----------|
| NavApp          | Complete |
| ShopApp         | Complete |
| secure-m        | Partial - need to update create and update .env file; and update index.html |
| Apache2         | Complete |
| nginx           | In Dev   |
| bashrc/zshrc    | Partial  |
| Update Proxy    | Complete |
| Host file       | Complete |
| Bloomies Assets | Complete |
| tmp             | Complete |

### What does it actually do?

* In NavApp:
  - Updates navapp-config.properties SDP_HOST, ASSETS_HOST, COMMON_ASSETS_HOST, SECURE_HOST, lcache_enabled, zookeeper_enabled, zookeeper_killswitch_framework_enabled, zookeeper_local_storage_enabled, and local_killswitch_overwrite_in_dev_mode_enabled
  - Updates pom.xml with paths to BloomiesCommonUI and BloomiesAssets
  - Updates web.xml with block to avoid having to manually restart the server everytime a change is made.
* In ShopApp:
  - Updates environment.properties SDP_HOST, ASSETS_HOST, SECURE_HOST, zookeeper_enabled, zookeeper_killswitch_framework_enabled, zookeeper_local_storage_enabled, and local_killswitch_overwrite_in_dev_mode_enabled
  - Updates pom.xml with paths to BloomiesCommonUI and BloomiesAssets
  - Updates web.xml with block to avoid having to manually restart the server everytime a change is made.
* In BloomiesAssets:
  - Updates pom.xml with paths to macysCSS, macysJS, and macysTemplates.
* In Apache:
  - Adds cert/key files to cert directory in /etc/apache2/cert (if cert directory does not exist, reapps.js creates it).
  - Adds proxy.conf to /etc/apache2/other (if proxy.conf exist, reapps.js replaces its contents with the contents of the compiled proxy.js template).
  - Updates hosts file. 
  - Updates httpd-ssl in /etc/apache2/extra. 
* In home directory:
  - Creates settings.xml file in ~/.m2 directory (if ~/.m2 does not directory exist, it is created).
* In shell (bash/zshrc):
  - Adds JAVA_HOME, MAVEN_HOME, MAVEN_OPTS, and M2_OPTS properties and values.
  - Adds reapps.js alias.

## Install Environment Dependencies
* Open xcode app and accept the license agreement.
* Add ssh [keys](https://code.devops.fds.com/profile/keys) to Gitlab.
* Clone and/or checkout 
   - [bloomies-ui-reapps](https://code.devops.fds.com/CAP/bloomies-ui-reapps) (that's this repo!) 
   - [NavApp](https://code.devops.fds.com/CAP/NavApp)
   - [ShopNServe (ShopApp)](https://code.devops.fds.com/CAP/ShopNServe)
   - [MacysUI](https://code.devops.fds.com/CAP/MacysUI)
     - From MacysUI root, run: `cp .npmrc ~/.npmrc`
   - [BloomiesCommonUI](https://code.devops.fds.com/CAP/BloomiesCommonUI)
   - [MobileCustomerAppUI](https://code.devops.fds.com/CAP/MobileCustomerAppUI) (secure-m)
   - BloomiesAssets
     - cli command: `svn co http://vcsnavy/wds/projects/Bloomies.war/trunk/BloomiesAssets/`
* Install system dependencies in the given order.
  - [homebrew](http://brew.sh/)
  - git (brew install git)
  - node (brew install node)
  - nvm installation instructions can be found here: https://github.com/creationix/nvm/blob/master/README.markdown
  - nginx (brew install nginx)
  - java (brew install Caskroom/versions/java7) - this command downloads the .pkg file.  Locate the file and double click to install.
  - maven (brew install maven)
* Add git, node, and nvm to your systems PATH variable.  Depending on your shell, this file will be ~/.bash_profile, /etc/bashrc, or ~/.zshrc file. To determine which is your shell, use `echo $0`. For example,
  - ```export GIT_HOME='/usr/local/Cellar/git/2.11.0'
  export PATH=$GIT_HOME/bin:$PATH```

## Install Chrome Browser Plugins
  - [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg?hl=en)
  - [Modify Headers](https://chrome.google.com/webstore/detail/modify-headers-for-google/innpjfdalfhpcoinfnehdnbkglpmogdi?hl=en-US)
  - [Coremetrics Bar](https://chrome.google.com/webstore/detail/coremetrics-bar-for-chrom/llegcghmokaemodgdddnchiijfdbfnlg)
  - [Signal Inspector](https://chrome.google.com/webstore/detail/signal-inspector/plhigdejmcnjiljpefhbcmllngmmjggp?hl=en)

## Install ReappsJS Dependencies
Clone the repo anywhere onto your computer, preferably to a directory called bloomies-ui-reapps.
* ReappsJS requires Node v6+. Use nvm to switch node versions. Examples:
    - `nvm install v6.9.4`
    - `nvm use v6.9.4`
    - `nvm use v4.7.2`
    - etc ...
* In bloomies-ui-reapps/ root, run `npm install`.
* Update reapps-properties.json with the path to your bloomies-ui-reapps, NavApp, ShopApp, BloomiesCommonUI, and BloomiesAssets repos.
* Set the defaults for branch and brand in reapps-properties.json.
* That's it!
  
## Basic Usage
* In reapps-properties.json, update the paths object so that the object properties point to the cloned repos and binaries for java and maven.  Property shellRc should point to a file that sets your shells PATH. The file depends on your shell (i.e. `/etc/bashrc`, `~/.zshrc`, or `~/.bash_profile`).  If the file does not exist, create it.
* Edit /etc/apache2/extra/httpd-ssl.conf and uncomment the following modules: socache_shmcb_module, ssl_module, and rewrite_module.  
* Edit /etc/apache2/httpd.conf and uncomment the line that includes httpd-ssl.conf.
* Users just starting out with reapps should run `node reapps --action=initBox`, after which commands can be executed from anywhere on the command line without prefixing the command with node.  For example, you'll be able to run the `node reapps --action=initBox` from anywhere on the command line with `reapps --action=initBox`. Make sure you get admin access admin access through Macy's Self Service app (command + spacebar and enter Macy's Self Service) before running `initBox` action.
* run `mvn clean install` from BloomiesCommonUI root
* run `mvn clean install -Dmaven.test.skip=true` in both NavApp/BloomiesNavApp and ShopNServe/BCOM roots.
* run `mvn jetty:run -o` in both NavApp/BloomiesNavApp/BloomiesNavAppWeb and ShopNServe/BCOM/BloomiesShopNServe

Note: Typically, `reapps --action=initBox` will be run only once after which developers can use other API calls to make changes to their environments (i.e. `reapps --action=updateSdpHost`).

## API
* Initialize everything!
  - API: `reapps --action=initBox`
  - Description: runs the following actions
       - initM2
       - initEnvs
       - initShell
       - initHosts
       - initHttpdSsl
       - initProxy
       - initCertAndKey
* Initialize .m2 directory
  - API: `reapps --action=initM2`
  - Description: Creates a ~/.m2 directory that contains ./settings.xml.
* Initialize environments
  - API: `reapps --action=initEnvs`
  - Description: runs the following actions
     - initNavAppEnv
     - initShopAppEnv
* Initialize NavApp 
  - API: `reapps --action=initNavAppEnv`
  - Description: Updates navapp-config.properties from reapps-properties.json and runs the following actions
     - setNavAppDomainPrefix
     - updateNavAppPomXml
     - updateNavAppWebXml
     - updateNavAppSdpHost
* Initialize ShopApp
  - API: `reapps --action=initShopAppEnv`
  - Description: Updates environment.properties from reapps-properties.json and runs the following actions
     - setNavAppDomainPrefix
     - updateNavAppPomXml
     - updateNavAppWebXml
     - updateNavAppSdpHost   
* Set navapp-config.properties domain prefix
  - API: `reapps --action=setDomainPrefix`
  - Description: Add domain prefix to url for ASSETS_HOST, COMMON_ASSETS_HOST, SECURE_HOST, and HOST. 
* Set ShopApp environment.properties domain prefix
  - API: `reapps --action=setDomainPrefix`
  - Description: Add domain prefix to url for ASSETS_HOST, SECURE_HOST, and HOST.    
* Get reapps-properties.json
  - API: `reapps --action=getReappsPropsJson`
  - Description: Logs the contents of reapps-properties.json to the terminal.   
* Get a list of environments
  - API: `reapps --action=listEnvs`
  - Description: Logs a list of environments to the terminal.
* Initialize proxy.conf
  - API: `reapps --action=initProxy`
  - Description: Initializes apache proxy file.
* Initialize httpd-ssl.conf
  - API: `reapps --action=initHttpdSsl`
  - Description: Initializes apache httpd-ssl file.
* Get IP for a qa environment
  - API: `reapps --action=getIp`
  - Description: Logs the GCE SDP_HOST IP to the terminal.
* Get IP for a GCE
  - API: `reapps --action=getGceIp`
  - Description: Logs the environment SDP_HOST IP to the terminal.
* Update SDP_HOST on both NavApp and ShopApp
  - API: `reapps --action=updateSdpHost`
  - Description: runs the following actions
     - updateNavAppSdpHost
     - updateShopAppSdpHost
* Update SDP_HOST on NavApp
  - API: `reapps --action=updateNavAppSdpHost`
  - Description: Updates SDP_HOST property in navapp-config.properties
* Update SDP_HOST on ShopApp
  - API: `reapps --action=updateShopAppSdpHost`
  - Description: Updates SDP_HOST property in environment.properties
* Add kill switches to killswitch.properties file for NavApp
  - API: `reapps --action=updateNavAppTmp --killSwitchList=test,test2`
  - Description: Adds `test=true` and `test2=true` to killswitch.properties file, unless kill switch names already exist. Every item in the killSwitchList will be set to true.
* Add kill switches to killswitch.properties file for ShopApp
  - API: `reapps --action=updateShopAppTmp --killSwitchList=test,test2`
  - Description: Adds `test=true` and `test2=true` to killswitch.properties file, unless kill switch names already exist. Every item in the killSwitchList will be set to true.
* Initialize NavApp and ShopApp property files
  - API: `reapps --action=initEnvs`
  - Description: Bundles actions setDomainPrefix and updateSdpHost.
* Update apache2 hosts file
  - API: `reapps --action=initHosts`
  - Description: Updates apache2 hosts file. 
* Update apache2 httpd-vhosts.conf file
  - API: `reapps --action=initHttpdVhosts`
  - Description: Updates apache2 httpd-vhosts.conf file.   
* Options:
  - The following options override default properties in reapps-properties.json:
     - --branch overrides the branch property
     - --brand overrides the brand property
     - --envName overrides the envName property
     - --domainPrefix overrides the domainPrefix property
  - To save properties passed as options to reapps-properties.json file, use the options flag --save.     
  - Example usage:
     - `reapps --action=getIp --envName=qa6codebloomingdales`
     - Description: The command will override the default value of envName property in reapps-properties.json file with the value of the option --envName.  The command will log the IP address for qa6, provided that this is a qa environment name assigned to the branch and brand.
     - `reapps --action=listEnvs --save --branch=17A`
     - Description: The command will generate a list of environments for branch 17A and save the branch value to reapps-properties.json.