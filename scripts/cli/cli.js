module.exports = require('yargs')
  .completion()
  .commandDir('../cli/cmds')
  .help()
  .options({
  'action': {
    alias: 'a',
    describe: 'action',
    choices: ['getIp', 'getNavAppKs', 'getShopAppKs', 'getReappsPropsJson', 'initBloomiesAssets', 'initBox', 'initCertAndKey', 'initEnvs', 'initHosts', 'initHttpdVhosts', 'initM2', 'initNavAppEnv', 'initProxyServer', 'initServerBlocks', 'initShell', 'initShopAppEnv', 'listEnvs', 'runMacysUiServer', 'updateSdpHost', 'updateShopAppSdpHost', 'updateNavAppSdpHost', 'updateNavAppPomXml', 'updateShopAppPomXml', 'updateShopAppTmp', 'updateNavAppTmp', 'updateShopAppWebXml', 'updateNavAppWebXml']
  },
  'force':{
    alias: 'f',
    describe: 'overwrite existing file'
  },
  'version':{
    alias: 'v',
    describe: 'ReappsJS package version'
  },
  'mci': {  //moved to cli directory.  Will be deprecated in favor of "re build <app>"
    describe: 'maven clean install',
    choices: ['navApp', 'shopApp', 'macysUi', 'bloomiesAssets']
  },
  'mcist': { //moved to cli directory. Will be deprecated in favor of "re build <app> -t"
    describe: 'maven clean install and skip tests',
    choices: ['navApp', 'shopApp', 'macysUi', 'bloomiesAssets']
  },
  'mcistd': { //moved to cli directory. Will be deprecated in favor of "re build <app> -t -d"
    describe: 'maven clean install, skip tests and enforcer',
    choices: ['navApp', 'shopApp', 'macysUi', 'bloomiesAssets']
  },
  'mjr': { //moved to cli directory. Will be deprecated in favor of "re run <app>"
    describe: 'maven jetty run',
    choices: ['navApp', 'shopApp', 'bloomiesAssets']
  },
  'mjro': { //moved to cli directory. Will be deprecated in favor of "re run <app> -o"
    describe: 'maven jetty run offline',
    choices: ['navApp', 'shopApp', 'bloomiesAssets']
  },
  'branch': {
    alias: 'b',
    describe: 'branch',
  },
  'envName': {
    alias: 'e',
    describe: 'environment name'
  },
  'killSwitchList': {
    alias: 'k',
    describe: 'kill switch list'
  },
  'brand': {
    alias: 'r',
    describe: 'brand',
    choices: ['MCOM', 'BCOM']
  },
  'save': {
    alias: 's',
    describe: 'save options'
  },
  'help': {
    alias: 'h',
    describe: 'help'
  }
}).help().argv;