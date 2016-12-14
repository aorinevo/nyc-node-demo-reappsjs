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

## Basic Use
* Clone NavApp, ShopApp, BloomiesCommonUI, and BloomiesAssets.
* Update system variables JAVA_HOME, MAVEN_OPTS, MAVEN_HOME, etc...
* In reapps-properties.json, update the paths object so that the object properties point to the cloned repos in (1).
* With "reapps" aliased (see above - How to alias a command), run "reapps --action=initEnvs" from anywhere in the command line.
* run "maven clean install" from BloomiesCommonUI root
* run "maven clean install --Dmaven.test.skip=true" in both NavApp/BloomiesNavApp and ShopNServe/BCOM roots.
* run "maven jetty:run -o" in both NavApp/BloomiesNavApp/BloomiesNavAppWeb and ShopNServe/BCOM/BloomiesShopNServe

## API
* Get a list of environments
  - API: reapps --action=listEnvs
  - Description: Logs a list of environments to the terminal.
* Get IP for a qa environment
  - API: reapps --action=getIp
  - Description: Logs the GCE SDP_HOST IP to the terminal.
* Get IP for a GCE
  - reapps --action=getGceIp
  - Description: Logs the environment SDP_HOST IP to the terminal.
* Update SDP_HOST
  - API: reapps --action=updateSdpHost
  - Description: Updates the SDP_HOST value in NavApp and ShopApp properties file.
* Set domain prefix
  - API: reapps --action=setDomainPrefix
  - Description:  on ASSETS_HOST, COMMON_ASSETS_HOST, SECURE_HOST, and HOST.
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