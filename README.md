## Introduction
ReappsJS is an NPM module that exposes a set of command-line utilities for installing, updating, building, and running left-nav demo app. Checkout the Basic Usage section for an example use case.

| Automation      | Status   |
|-----------------|----------|
| left-nav-backend         | Complete  |
| left-nav-frontend        | Complete |

### What does it actually do?

* In Apache:
  - Adds nyc-node-httpd-vhosts.conf to /etc/apache2/other (if the file exist and the user wants the file to be overwritten, pass the flag `-f`).
  - Updates hosts file.  
* Build apps from anywhere in the command line.
* Run apps from anywhere in the command line.

## Installing Environment Dependencies
* Open xcode app and accept the license agreement. (Optional. Applies only for BCOM laptops.)
* Install homebrew and git (Homebrew is a package manager/installer which installs packages to their own directory and then symlinks their files into /usr/local.)
  - [Homebrew](http://brew.sh/)
  - `brew install git`
* Clone
  - Create a 'Repositories' folder in your root directory `your-username/Repositories/`
  - [reappsjs](https://code.devops.fds.com/CAP/reappsjs) (that's this repo!)
  - [left-nav-frontend](https://code.devops.fds.com/CAP/left-nav-frontend)
  - [left-nav-backend](https://code.devops.fds.com/CAP/left-nav-backend) (that's this repo!)
* Install system dependencies in the given order.
  - nvm installation instructions can be found here: https://github.com/creationix/nvm/ and run the following
    - `nvm install 6.9.4`
    - `nvm use 6.9.4`
    - If nvm cannot be found, restart the terminal and try the above commands again.  If you need to use a different version of node, run the first two commands with the version of node you want to use.
  - If git and nvm are not on your system's PATH variable, add them!  Depending on your shell, the file you will need to modify will be ~/.bash_profile, /etc/bashrc, or ~/.zshrc. To determine which one, use `echo $0`.  An example of adding git to system variables:

  ```
    export GIT_HOME='/usr/local/Cellar/git/2.13.1'
    export PATH=$GIT_HOME/bin:$PATH
  ```

## Installing ReappsJS
Clone the ReappsJS repo `https://code.devops.fds.com/CAP/reappsjs.git` anywhere onto your computer, preferably to a directory called reappsjs.
* Update reapps-properties.json with the correct paths to your proxy server (either apache24 or nginx), reappsjs, NavApp, ShopApp, BloomiesCommonUI, MacysUI, and BloomiesAssets repos. <b>Remember:</b> These folder and file paths are relative to your laptop and you may not have the same folder structure. The goal here is to point all target paths to the correct folders. See example below from `reapps-properties.json`

```
    "paths": {
      "hostsFile": "/etc/hosts",
      "shellRc": "/Users/U060014/.zshrc",
      "leftNavBackend": "/Users/U060014/Repositories/nyc-node-demo/left-nav-backend",
      "leftNavFrontend": "/Users/U060014/Repositories/nyc-node-demo/left-nav-frontend",
      "bloomies-ui-reapps": "/Users/U060014/Repositories/reappsjs"
    }
```

* Set the defaults for branch and brand in reapps-properties.json. See example below.

```
  {
    "username": "your-username",
    "proxyServer": {
      "name": "apache24",
      "path": "/etc/apache2" //Paths relative to your laptop for apache installations.
      }
  }
```

* Now that we have cloned and configured Reapps, it is time to install and link it globally.
* In reappsjs/ root directory, run `npm link`.
* That's it!

## Basic Usage
* In reapps-properties.json, update the paths object so that the object's properties point to the cloned repos.  Property shellRc should point to a file that sets your shells PATH. The file name depends on your shell (i.e. `/etc/bashrc`, `~/.zshrc`, or `~/.bash_profile`).  If the file does not exist, create it.
* Build left-nav-backend: `re build left-nav-backend`
* Run left-nav-backend: `re run left-nav-backedn`

## API
APIs support long and short flags (i.e. `re -v` and `re --version`).
* Short flags dictionary
  - h: "help"
  - v: "version"
  - f: "force"
* Get ReappsJS version
  - API: `re -v`
* Get reapps-properties.json
  - API: `re get reapps-props`
  - Description: Logs the contents of reapps-properties.json to the terminal.   
* Update apache2 hosts file
  - API: `re init hosts`
  - Description: Updates apache2 hosts file.
* Create/update apache2 nyc-node-httpd-vhosts.conf file
  - API: `re init httpd-vhosts`
  - Description: Creates or updates apache2 nyc-node-httpd-vhosts.conf file in 'other' directory. 
* Run left-nav-backend
  - API: `re run left-nav-backend`
  - Description: Runs left-nav-backend
* Run left-nav-frontend
  - API: `re run left-nav-frontend`
  - Description: Runs left-nav-frontend