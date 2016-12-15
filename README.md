## Introduction
Reapps.js is a custom NPM module that automates parts of the NavApp/ShopApp set-up process. Checkout the Basic Usage section for an example use case.

### What does it actually do?

* In NavApp
  - Updates navapp-config.properties SDP_HOST, ASSETS_HOST, COMMON_ASSETS_HOST, SECURE_HOST, lcache_enabled, zookeeper_enabled, zookeeper_killswitch_framework_enabled, zookeeper_local_storage_enabled, and local_killswitch_overwrite_in_dev_mode_enabled
  - Updates pom.xml with paths to BloomiesCommonUI and BloomiesAssets
  - Updates web.xml with block to avoid having to manually restart the server everytime a change is made.
* In ShopApp
  - Updates navapp-config.properties SDP_HOST, ASSETS_HOST, SECURE_HOST, zookeeper_enabled, zookeeper_killswitch_framework_enabled, zookeeper_local_storage_enabled, and local_killswitch_overwrite_in_dev_mode_enabled
  - Updates pom.xml with paths to BloomiesCommonUI and BloomiesAssets
  - Updates web.xml with block to avoid having to manually restart the server everytime a change is made.
* In Apache
  - Adds cert/key files to cert directory in /etc/apache2/cert (if cert directory does not exist, it is created).
  - Adds proxy.conf to /etc/apache2/other (if proxy.conf exist, it replaces the content with the compiled proxy.js template).
* In home directory
  - Creates settings.xml file in ~/.m2 directory (if ~/.m2 does not directory exist, it is created).

## Installation
Clone the repo anywhere onto your computer, preferably to a directory called bloomies-ui-reapps.
* In bloomies-ui-reapps/ run 'npm install'.
* Update reapps-properties.json with the path to your NavApp, ShopApp, BloomiesCommonUI, and BloomiesAssets repos.
* Set the defaults for branch and brand in reapps-properties.json.
* Optional: Set alias "reapps" for command "node reapps.js".
* That's it!

How to alias a command:  Your shell is mostly likely either using bash or zsh.  Depending on your shell, do the following:
* bash
  - Open ~/.bashrc file.
  - Add the following
     - alias reapps="node /Users/u060014/Repositories/bloomies-ui/bloomies-ui-reapps/reapps.js "
  - In your terminal, run "source ~/.bashrc"
* zsh
  - Open ~/.zshrc file.
  - Add the following
     - alias reapps="node /Users/u060014/Repositories/bloomies-ui/bloomies-ui-reapps/reapps.js "
  - In your terminal, run "source ~/.zshrc"

In either case, replace the path in the above command with the path that points to the location of the reapps.js file on your local machine.

## Basic Usage
* Clone and/or checkout bloomies-ui-reapps (this repo), NavApp, ShopApp, BloomiesCommonUI, and BloomiesAssets.
* Install dependencies
  - Java
  - Maven
* In reapps-properties.json, update the paths object so that the object properties point to the cloned repos in (1).
* With "reapps" aliased (see above - How to alias a command), run "reapps --action=initBox" from anywhere in the command line. You'll need to obtain admin access through Macy's Self Service app (command + spacebar and enter Macy's Self Service).
* run "maven clean install" from BloomiesCommonUI root
* run "maven clean install --Dmaven.test.skip=true" in both NavApp/BloomiesNavApp and ShopNServe/BCOM roots.
* run "maven jetty:run -o" in both NavApp/BloomiesNavApp/BloomiesNavAppWeb and ShopNServe/BCOM/BloomiesShopNServe

## API
* Initialize everything!
  - API: reapps --action=initBox
  - Description: runs the following actions
       - initM2
       - initEnvs
       - initShell
       - initProxy
* Initialize .m2 directory
  - API: reapps --action=initM2
  - Description: Creates a ~/.m2 directory that contains ./settings.xml.
* Initialize environments
  - API: reapps --action=initEnvs
  - Description: runs the following actions
     - initNavAppEnv
     - initShopAppEnv
* Initialize NavApp 
  - API: reapps --action=initNavAppEnv
  - Description: Updates navapp-config.properties from reapps-properties.json and runs the following actions
     - setNavAppDomainPrefix
     - updateNavAppPomXml
     - updateNavAppWebXml
     - updateNavAppSdpHost
* Initialize ShopApp
  - API: reapps --action=initShopAppEnv
  - Description: Updates environment.properties from reapps-properties.json and runs the following actions
     - setNavAppDomainPrefix
     - updateNavAppPomXml
     - updateNavAppWebXml
     - updateNavAppSdpHost   
* Set navapp-config.properties domain prefix
  - API: reapps --action=setDomainPrefix
  - Description: Add domain prefix to url for ASSETS_HOST, COMMON_ASSETS_HOST, SECURE_HOST, and HOST. 
* Set ShopApp environment.properties domain prefix
  - API: reapps --action=setDomainPrefix
  - Description: Add domain prefix to url for ASSETS_HOST, SECURE_HOST, and HOST.       
* Get a list of environments
  - API: reapps --action=listEnvs
  - Description: Logs a list of environments to the terminal.
* Get IP for a qa environment
  - API: reapps --action=getIp
  - Description: Logs the GCE SDP_HOST IP to the terminal.
* Get IP for a GCE
  - reapps --action=getGceIp
  - Description: Logs the environment SDP_HOST IP to the terminal.
* Update SDP_HOST on both NavApp and ShopApp
  - API: reapps --action=updateSdpHost
  - Description: runs the following actions
     - updateNavAppSdpHost
     - updateShopAppSdpHost
* Update SDP_HOST on NavApp
  - API: reapps --action=updateNavAppSdpHost
  - Description: Updates SDP_HOST property in navapp-config.properties
* Update SDP_HOST on ShopApp
  - API: reapps --action=updateShopAppSdpHost
  - Description: Updates SDP_HOST property in environment.properties  
* Initialize NavApp and ShopApp property files
  - API: reapps --action=initEnvs
  - Description: Bundles actions setDomainPrefix and updateSdpHost.
* Options:
  - The following options override default properties in reapps-properties.json:
     - --branch overrides the branch property
     - --brand overrides the brand property
     - --envName overrides the envName property
     - --domainPrefix overrides the domainPrefix property
  - Example usage:
     - reapps --action=getIp --envName=qa6codebloomingdales
     - Description: The command will override the default value of envName property in reapps-properties.json file with the value of the option --envName.  The command will log the IP address for qa6, provided that this is a qa environment name assigned to the branch and brand.