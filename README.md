## Introduction
ReappsJS is an NPM module that exposes a set of command-line utilities for installing, updating, building, and running Macy's and Bloomingdale's applications. Checkout the Basic Usage section for an example use case.

| Automation      | Status   |
|-----------------|----------|
| NavApp          | Complete |
| ShopApp         | Complete |
| MacysUI Assets Server | Complete |
| secure-m        | Partial - need to create and update .env file; and update index.html.  Now certs are included in the MobileCustomerAppUI (but not all) repo. |
| Apache2         | Complete |
| nginx           | Complete |
| bashrc/zshrc    | Complete |
| Host file       | Complete |
| Bloomies Assets | Complete |
| tmp             | Complete |
| Dual Brand      | In dev   |

### What does it actually do?

* In NavApp:
  - Updates navapp-config.properties
  - Updates pom.xml with paths to BloomiesCommonUI and BloomiesAssets
  - Updates web.xml with block to avoid having to manually restart the server everytime a change is made.
* In ShopApp:
  - Updates environment.properties
  - Updates pom.xml with paths to BloomiesCommonUI and BloomiesAssets
  - Updates web.xml with block to avoid having to manually restart the server everytime a change is made.
* In BloomiesAssets:
  - Updates pom.xml with paths to macysCSS, macysJS, and macysTemplates.
* In Apache:
  - Adds cert/key files to cert directory in /etc/apache2/cert (if cert directory does not exist, reapps.js creates it).
  - Adds bcom-httpd-vhosts.conf to /etc/apache2/other (if the file exist and the user wants the file to be overwritten, pass the flag `-f`).
  - Updates hosts file. 
* In Nginx (reapps is configured to use Apache by default.  Change proxyServer property in reapps-properties.json to use nginx.):
  - Adds cert/key files to cert directory in /usr/local/etc/nginx/cert (if cert directory does not exist, reapps.js creates it).
  - Adds bcom-server-blocks.conf to /usr/local/etc/nginx/servers (if the file exist and the user wants the file to be overwritten, pass the flag `-f`).
  - Updates hosts file.   
* In home directory:
  - Creates settings.xml file in ~/.m2 directory (if ~/.m2 does not directory exist, it is created).
* In shell (bash/zshrc):
  - Adds JAVA_HOME, MAVEN_HOME, MAVEN_OPTS, and M2_OPTS properties and values.
* Build apps from anywhere in the command line.
* Run apps from anywhere in the command line.
* See changes in real time without having to recompile huge chunks of MacysUI:
  - Uses grunt server in place of BloomiesAssets server.
* Get list of QA environments based on branch and brand.
* And more!!! (see API section)

## Install Environment Dependencies
* Open xcode app and accept the license agreement.
* Add ssh [keys](https://code.devops.fds.com/profile/keys) to Gitlab.
* Clone
   - [reappsjs](https://code.devops.fds.com/CAP/reappsjs) (that's this repo!) 
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
  - nvm installation instructions can be found here: https://github.com/creationix/nvm/blob/master/README.markdown and run the following
     - `nvm install 4.7.2`
     - `nvm use 4.7.2`
     - If nvm cannot be found, restart the terminal and try the above commands again.  If you need to use a different version of node, run the first two commands with the version of node you want to use.
  - grunt-cli (npm install -g grunt-cli)
  - Optional: nginx (brew install nginx) - the default proxy server is apache.
  - java (brew install Caskroom/versions/java7) - this command downloads the .pkg file.  Locate the file and double click to install.
  - maven (brew install maven)
* If git and nvm are not on your system's PATH variable, add them!  Depending on your shell, the file you will need to modify will be ~/.bash_profile, /etc/bashrc, or ~/.zshrc. To determine which one, use `echo $0`.  An example of adding git to system variables:
  - ```export GIT_HOME='/usr/local/Cellar/git/2.11.0'
  export PATH=$GIT_HOME/bin:$PATH```

## Install ReappsJS
Clone the repo anywhere onto your computer, preferably to a directory called reappsjs.
* Update reapps-properties.json with the path to your proxy server (either apache24 or nginx), reappsjs, NavApp, ShopApp, BloomiesCommonUI, MacysUI, and BloomiesAssets repos.
* Set the defaults for branch and brand in reapps-properties.json.    
* In reappsjs/ root, run `npm install -g && npm link`.
* That's it!

## Install Chrome Browser Plugins
  - [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg?hl=en)
  - [Modify Headers](https://chrome.google.com/webstore/detail/modify-headers-for-google/innpjfdalfhpcoinfnehdnbkglpmogdi?hl=en-US)
  - [Coremetrics Bar](https://chrome.google.com/webstore/detail/coremetrics-bar-for-chrom/llegcghmokaemodgdddnchiijfdbfnlg)
  - [Signal Inspector](https://chrome.google.com/webstore/detail/signal-inspector/plhigdejmcnjiljpefhbcmllngmmjggp?hl=en)
  
## Basic Usage
* In reapps-properties.json, update the paths object so that the object properties point to the cloned repos and binaries for java and maven.  Property shellRc should point to a file that sets your shells PATH. The file depends on your shell (i.e. `/etc/bashrc`, `~/.zshrc`, or `~/.bash_profile`).  If the file does not exist, create it.
* Users just starting out with reapps should run `re -a initBox`.  Make sure you get admin access admin access through Macy's Self Service app (command + spacebar and enter Macy's Self Service) before running `initBox` action.
* Build ShopApp and skip tests: `re build shopApp`
* Run ShopApp offline: `re run shopApp`
* Build NavApp, skip tests, and run offline: `re build navApp && re run navApp`

Note: Typically, `re -a initBox` will be run only once after which developers can use other APIs to make changes to their environments (i.e. `re -a updateSdpHost`).

## API
APIs support long and short flags (i.e. `re -v` and `re --version`).
* Short flags dictionary
  - b: "branch"
  - e: "envName"
  - k: "killSwitchList"
  - r: "brand"
  - h: "help"
  - v: "version"
  - f: "force"
* Get ReappsJS version
  - API: `re -v`
* Get NavApp zookeeper killswitches and values
  - API: `re get navapp ks`
  - Description: Returns the contents of navApp zookeeper file.
* Get ShopApp zookeeper killswitches and values
  - API: `re get shopapp ks`
  - Description: Returns the contents of shopApp zookeeper file.
* Get reapps-properties.json
  - API: `re get reapps-props`
  - Description: Logs the contents of reapps-properties.json to the terminal.   
* Get a list of environments
  - API: `re get listEnvs`
  - Description: Logs a list of environments to the terminal.
* Get IP for a qa environment
  - API: `re get sdp`
  - Description: Logs the GCE SDP_HOST IP to the terminal.
* (Not Implemented) Get SDP_HOST for a GCE
  - API: `re get sdp gce`
  - Description: Get GCE SDP_HOST.
* Initialize everything! (Need admin access)
  - API: `re init box`
  - Description: Equivalent to running
      - `re init hosts`
      - `re init shell`
      - `re init shopapp`
      - `re init navapp`
      - `re init bloomies-assets`
      - `re init m2`
      - `re init apache` or `re init nginx`
* Initialize .m2 directory
  - API: `re init m2`
  - Description: Creates a ~/.m2 directory that contains ./settings.xml.
* Initialize NavApp 
  - API: `re init navapp`
  - Description: Updates 
     - navapp-config.properties from reapps-properties.json
     - pom.xml
     - web.xml
     - SDP_HOST
* Initialize ShopApp
  - API: `re init shopapp`
  - Description: Updates 
     - environment.properties from reapps-properties.json
     - pom.xml
     - web.xml
     - SDP_HOST
* Update apache2 hosts file
  - API: `re init hosts`
  - Description: Updates apache2 hosts file. 
* Create/update apache2 bcom-httpd-vhosts.conf file
  - API: `re init httpd-vhosts`
  - Description: Creates or updates apache2 httpd-vhosts.conf file in others directory.   
* Create/update nginx bcom-server-blocks.conf file
  - API: `re init server-blocks`
  - Description: Creates or updates nginx bcom-server-blocks.conf file in servers directory. 
* Build navApp
  - API: `re build navapp`
  - options: 
    - `-t` run tests
    - `-d` run with enforcer
  - Description: Builds NavApp, runs tests if `t` flag is present, and runs enforcer if `d` flag is present.
* Build shopApp
  - API: `re build shopapp`
  - options: 
    - `-t` run tests
    - `-d` run with enforcer
  - Description: Builds ShopApp, runs tests if `t` flag is present, and runs enforcer if `d` flag is present.
* Build macysUi
  - API: `re build macysui`
  - options: 
      - `-t` run tests
      - `-d` run with enforcer
  - Description: Builds MacysUI, runs tests if `t` flag is present, and runs enforcer if `d` flag is present.
* Build bloomiesAssets
  - API: `re build bloomies-assets`
  - options: 
      - `-t` run tests
      - `-d` run with enforcer
  - Description: Builds BloomiesAssets, runs tests if `t` flag is present, and runs enforcer if `d` flag is present.  
* Run MacysUI Assets Server
  - API: `re run macysui`
  - Description: Runs grunt server for MacysUI instead of BloomiesAssets.  After running the assets server one time, edit the assets-server-properties file to watch the directories where changes are being made. Note: Do not run both at the same time!
* Run ShopApp
  - API: `re run shopapp`
  - Description: Runs ShopApp
* Run NavApp
  - API: `re run navapp`
  - Description: Runs NavApp
* Run BloomiesAssets
  - API: `re run bloomies-assets`
  - Description: Runs BloomiesAssets
* Update SDP_HOST on NavApp
  - API: `re update sdp navapp`
  - Description: Updates SDP_HOST property in navapp-config.properties
* Update SDP_HOST on ShopApp
  - API: `re update sdp shopapp`
  - Description: Updates SDP_HOST property in environment.properties
* Add kill switches to killswitch.properties file for NavApp
  - API: `re update ks navapp -k test=false,test2`
  - Description: If kill switch `test` exists in the zookeeper file, then the command updates its value to false.  If test does not exist, then adds it and sets its value to `false`.  If no value is specified, then kill switch is set to `true`.
* Add kill switches to killswitch.properties file for ShopApp
  - API: `re update ks navapp -k test=false,test2`
  - Description: If kill switch `test` exists in the zookeeper file, then the command updates its value to false.  If test does not exist, then adds it and sets its value to `false`.  If no value is specified, then kill switch is set to `true`.  
* Options:
  - The following options override default properties in reapps-properties.json:
     - --branch overrides the branch property
     - --brand overrides the brand property
     - --envName overrides the envName property
     - --domainPrefix overrides the domainPrefix property
  - To save properties passed as options to reapps-properties.json file, use the options flag --save.     
  - Example usage:
     - `re get sdp -e qa6codebloomingdales`
     - Description: The command will override the default value of envName property in reapps-properties.json file with the value of the option --envName.  The command will log the IP address for qa6, provided that this is a qa environment name assigned to the branch and brand.
     - `re -a listEnvs -s -b 17A`
     - Description: The command will generate a list of environments for branch 17A and save the branch value to reapps-properties.json.

## Deprecated API
  * `re -a ...`
  * `re -a initProxy`
  * `re -a setShopAppDomainPrefix`
  * `re -a setNavAppDomainPrefix`
  * `re --mci`
  * `re --mcist`
  * `re --mcistd`
  * `re --mjr`
  * `re --mjro`