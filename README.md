## Installation
Clone the repo anywhere onto your computer, preferably to a directory called bloomies-ui-reapps.
* In bloomies-ui-reapps/ run 'npm install'.
* Update reapps-properties.json with the full path to your NavApp (ShopApp) repo.
* Set the defaults for branch and brand in reapps-properties.json.
* Optional: Set alias "reapps" for command "node reapps.js".
* That's it!

How to alias a command:  Your shell is mostly likely either using bash or zsh.  Depending on your shell, do the following:
* bash
  - Open ~/.bashrc file.
  - Add the following
    - alias reapps="node /Users/u060014/Repositories/bloomies-ui/Reapps/reapps.js "
  - In your terminal, run "source ~/.bashrc"
* zsh
  - Open ~/.zshrc file.
  - Add the following
    - alias reapps="node /Users/u060014/Repositories/bloomies-ui/Reapps/reapps.js "
  - In your terminal, run "source ~/.zshrc"

In either case, replace the path in the above command with the path that points to the location of the reapps.js file on your local machine.

## Basic UserAgent
* Clone NavApp, ShopApp, BloomiesCommonUI, and BloomiesAssets.
* Update system variables JAVA_HOME, MAVEN_OPTS, MAVEN_HOME, etc...
* In reapps-properties.json, update the paths object so that the object properties point to the cloned repos in (1).
* With "reapps" aliased (see above - How to alias a command), run "reapps --action=initEnvs" from anywhere in the command line.
* run "maven clean install" from BloomiesCommonUI root
* run "maven clean install --Dmaven.test.skip=true" in both NavApp/BloomiesNavApp and ShopNServe/BCOM roots.
* run "maven jetty:run -o" in both NavApp/BloomiesNavApp/BloomiesNavAppWeb and ShopNServe/BCOM/BloomiesShopNServe