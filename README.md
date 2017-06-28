## Introduction
ReappsJS is an NPM module that exposes a set of command-line utilities for installing, updating, building, and running Macy's and Bloomingdale's applications. Checkout the Basic Usage section for an example use case.

| Automation      | Status   |
|-----------------|----------|
| Polaris         | Partial - create/delete page-level polaris components/pages  |
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

## Installing Environment Dependencies
* Get Admin access (<b>Note:</b> Optional. Applies only to BCOM Laptops. Skip this and proceed to 'Add SSH' keys if you have a non BCOM laptop/desktop.)
  - Open Macy's Self Service and login
  - Go to 'MCOM Demo' under Categories
  - Click 'ACCEPT' under 'Make Me Admin'
* Open xcode app and accept the license agreement. (Optional. Applies only for BCOM laptops.)
* Add SSH keys to Gitlab.
  - <a href="https://code.devops.fds.com/help/ssh/README" target="_blank">Click Here</a> to generate an SSH Key depending on your OS. Follow the steps listed carefully and in order.
  - Once you have the SSH Key generated and copied in your clipboard as mentioned above,
  <a href="https://code.devops.fds.com/profile/keys" target="_blank">Click Here</a> and follow the steps mentioned to add them to Gitlab.
* iTerm2 Setup (iTerm is a replacement for Terminal on Mac. It brings the terminal into the modern age with features like syntax highlighting, themes, etc. Read More <a href="https://www.iterm2.com/" target="_blank">here.</a>). The below steps listed will set the correct paths needed for iTerm to come at par with native Terminal behavior.
    * Change Terminal shell path
      - In Terminal open preferences
      - Under the General tab go to 'Shells open with' and select the radio option 'Command (complete path)'
      - Set path to `/bin/zsh` in the text field.
  - Install iterm2 and set preferences. Download: https://www.iterm2.com/downloads.html (download the stable release) With admin access, move app into your Applications folder
      - Change default shell to zsh over bash and choose your theme .
      - Change the default shell to zsh: run `sudo chsh -s /bin/zsh`
      - Enter your Admin password when prompted. (Note: For non BCOM Laptops this will be the admin password specific to your username)
      - (Optional)Set theme to Dark Background: iTerm -> preferences -> profiles -> colors -> load presets
  - Clone and install Prezto. (Prezto is the configuration framework for Zsh; it enriches the command line interface environment with sane defaults, aliases, functions, auto completion, and prompt themes.)
    ```
      git clone --recursive https://github.com/sorin-ionescu/prezto.git "${ZDOTDIR:-$HOME}/.zprezto"
    ```
      - Restart iTerm or Terminal
      - Copy and paste the following command into iTerm (preferred) or Terminal:
    ```
      setopt EXTENDED_GLOB
        for rcfile in "${ZDOTDIR:-$HOME}"/.zprezto/runcoms/^README.md; do
          ln -s "$rcfile" "${ZDOTDIR:-$HOME}/.${rcfile:t}"
        done
    ```
    - If you are getting errors, like 'file already exists', you can delete all files that start with .z from ~/
  - Install your favorite IDE (Atom/VSCode/Sublime are recommended ones).
    - Option 1: Using brew cask
      1. Install [homebrew](http://brew.sh/)
      2. run: `brew cask install atom`
    - Option 2: Downloading binaries from respective websites.
      1. Download dmg from https://atom.io/
      2. With admin access, move app into your Applications folder
      3. In Atom, Atom -> Install Shell Commands
  - Change the theme in ~/.zpreztorc to steeef (Line 95, at time of writing this doc)
Notes:
    - If you are using sublime, make sure to add an alias in ~/.zshrc file:
     ```
      #Applications
      alias sublime="open -a /Applications/Sublime.app"
     ```
     - Also for sublime users, make sure you have sublime in your Applications folder and name the app Sublime.app (The default name is Sublime Text.app)
* Install homebrew and git (Homebrew is a package manager/installer which installs packages to their own directory and then symlinks their files into /usr/local.)
  - [Homebrew](http://brew.sh/)
  - `brew install git`
* Clone
  - Create a 'Repositories' folder in your root directory `your-username/Repositories/`
  - [reappsjs](https://code.devops.fds.com/CAP/reappsjs) (that's this repo!)
  - [NavApp](https://code.devops.fds.com/CAP/NavApp)
  - [ShopNServe (ShopApp)](https://code.devops.fds.com/CAP/ShopNServe)
  - [MacysUI](https://code.devops.fds.com/CAP/MacysUI)
    - From MacysUI root, run: `cp .npmrc ~/.npmrc`
  - [BloomiesCommonUI](https://code.devops.fds.com/CAP/BloomiesCommonUI)
  - [MobileCustomerAppUI](https://code.devops.fds.com/CAP/MobileCustomerAppUI) (secure-m)
  - BloomiesAssets (SVN Repository)
    - cli command: `svn co http://vcsnavy/wds/projects/Bloomies.war/trunk/BloomiesAssets/`
* Install system dependencies in the given order.
  - nvm installation instructions can be found here: https://github.com/creationix/nvm/ and run the following
    - `nvm install 4.7.2`
    - `nvm use 4.7.2`
    - If nvm cannot be found, restart the terminal and try the above commands again.  If you need to use a different version of node, run the first two commands with the version of node you want to use.
  - If git and nvm are not on your system's PATH variable, add them!  Depending on your shell, the file you will need to modify will be ~/.bash_profile, /etc/bashrc, or ~/.zshrc. To determine which one, use `echo $0`.  An example of adding git to system variables:

  ```
    export GIT_HOME='/usr/local/Cellar/git/2.13.1'
    export PATH=$GIT_HOME/bin:$PATH
  ```
  - grunt-cli (npm install -g grunt-cli)
  - Optional: nginx (brew install nginx) - the default proxy server is apache.
  - Download JAVA7 from Oracle's Website at <a  href="http://www.oracle.com/technetwork/java/javase/downloads/java-archive-downloads-javase7-521261.html" target="_blank">Oracle Archive Download</a>
  - Look for <b>Java SE Development Kit 7u80</b> It is important that you download JDK7 and not 8 since all applications are using version 7.
  - maven (brew install maven)

## Installing ReappsJS
Clone the ReappsJS repo `https://code.devops.fds.com/CAP/reappsjs.git` anywhere onto your computer, preferably to a directory called reappsjs.
* Update reapps-properties.json with the correct paths to your proxy server (either apache24 or nginx), reappsjs, NavApp, ShopApp, BloomiesCommonUI, MacysUI, and BloomiesAssets repos. <b>Remember:</b> These folder and file paths are relative to your laptop and you may not have the same folder structure. The goal here is to point all target paths to the correct folders. See example below from `reapps-properties.json`

```
  "paths": {
    "shellRc": "/Users/your-username/.zshrc",
    "tmp": "/tmp",
    "bloomies-ui-reapps": "/Users/your-username/Repositories/reappsjs",
    "bloomiesCommonUi": "/Users/your-username/Repositories/BloomiesCommonUI",
    "macysCommonUi": "/Users/your-username/Repositories/MacysCommonUI",
    "bloomiesAssets": "/Users/your-username/Repositories/BloomiesAssets",
    "macysAssets": "/Users/your-username/Repositories/BloomiesAssets",
    "macysUi": "/Users/your-username/Repositories/MacysUI",
    "navApp": "/Users/your-username/Repositories/NavApp",
    "shopApp": "/Users/your-username/Repositories/ShopNServe",
    "creditGateway": "/Users/your-username/Repositories/Polaris/credit-gateway",
    "customerPreferences": "/Users/your-username/Repositories/Polaris/customer-preferences",
    "authWeb": ""
  }
```

* Set the defaults for branch and brand in reapps-properties.json. See example below.

```
  {
    "username": "your-username",
    "branch": "17K", //The release/branch name
    "brand": "BCOM", //BCOM or MCOM
    "envName": "qa7codebloomingdales", //This is the QA enviorenment which can change depending on availability.
    "domainPrefix": "your-name", //The domain prefix you want on your local env.
                                // example:your-name.bloomingdales.com
    "proxyServer": {
      "name": "apache24",
      "path": "/etc/apache2" //Paths relative to your laptop for apache installations.
      }
  }
```

* Now that we have cloned and configured Reapps, it is time to install and link it globally.
* In reappsjs/ root directory, run `npm link`.
* That's it!

## Install Chrome Browser Plugins
  - [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg?hl=en)
  - [Modify Headers](https://chrome.google.com/webstore/detail/modify-headers-for-google/innpjfdalfhpcoinfnehdnbkglpmogdi?hl=en-US)
  - [Coremetrics (official)](https://chrome.google.com/webstore/detail/ibm-digital-analytics-tag/konpolbafhiddhaejcajkobccaeedhpb)
  - [Coremetrics Bar](https://chrome.google.com/webstore/detail/coremetrics-bar-for-chrom/llegcghmokaemodgdddnchiijfdbfnlg)
  - [Signal Inspector](https://chrome.google.com/webstore/detail/signal-inspector/plhigdejmcnjiljpefhbcmllngmmjggp?hl=en)

## Basic Usage
* In reapps-properties.json, update the paths object so that the object's properties point to the cloned repos and binaries for java and maven.  Property shellRc should point to a file that sets your shells PATH. The file name depends on your shell (i.e. `/etc/bashrc`, `~/.zshrc`, or `~/.bash_profile`).  If the file does not exist, create it.
* Users just starting out with reapps should run `re init box`.  Get admin access through Macy's Self Service app (command + spacebar and enter Macy's Self Service) before running `re init box` action.
* Source (run: `source ~/.zshrc` ) or restart all terminal sessions after `re init box`. Alternatively you can restart your computer.
* Build ShopApp and skip tests and skip enforcer: `re build shopApp`
* Run ShopApp offline: `re run shopApp`
* Build NavApp, skip tests, skip enforcer, and run offline: `re build navApp && re run navApp`

Note: Typically, `re init box` will be run only once after which developers can use other APIs to make changes to their environments (i.e. `re get listEnvs`).

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
* Add entry points to a polaris project
  - `re new polaris --proj credit-gateway entry-point`
  - Adds `app-bcom` and `app-mcom` entry points to credit-gateway project
* Create page level component to a polaris project
  - `re new polaris --proj credit-gateway component -n AnotherComponent`
  - Adds hbs, scss, spec, and view under directory bcom/components/AnotherComponent, common/components/AnotherComponent, and mcom/components/AnotherComponent.  If the directories do not exist, they are created.
* Create page level page to a polaris project
  - `re new polaris --proj credit-gateway page -n AnotherPage`
  - Adds hbs, scss, spec, and view under directory bcom/pages/AnotherPage, common/pages/AnotherPage, and mcom/pages/AnotherPage.  If the directories do not exist, they are created.
* Delete page level component of a polaris project
  - `re delete polaris --proj credit-gateway component -n AnotherComponent`
  - Deletes directories bcom/components/AnotherComponent, common/components/AnotherComponent, and mcom/components/AnotherComponent in views/templates, scss, src, and tests.
* Delete page level page of a polaris project  
  - `re delete polaris --proj credit-gateway page -n AnotherPage`
  - Deletes directories bcom/pages/AnotherPage, common/pages/AnotherPage, and mcom/pages/AnotherPage in views/templates, scss, src, and tests.
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
