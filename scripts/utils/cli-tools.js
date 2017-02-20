module.exports = require('yargs').options({
  'action': {
    alias: 'a',
    describe: 'action',
    choices: ['initBox','listEnvs','initShopApEnv','initNavAppEnv','initBloomiesAssets','initEnvs','initCertAndKey', 'initProxyServer','initShell', 'initHosts','updateSdpHost', 'updateShopAppSdpHost', 'updateNavAppSdpHost','initHttpdVhosts', 'initServerBlocks', 'initM2', 'getIp', 'getReappsPropsJson', 'updateNavAppPomXml', 'updateShopAppPomXml', 'updateShopAppTmp', 'updateNavAppTmp', 'updateShopAppWebXml', 'updateNavAppWebXml']
  },
  'version':{
    alias: 'v',
    describe: 'ReappsJS package version'
  },
  'mci': {
    describe: 'maven clean install',
    choices: ['navApp', 'shopApp', 'macsyUi', 'bloomeisAssets']
  },
  'mcist': {
    describe: 'maven clean install and skip tests',
    choices: ['navApp', 'shopApp', 'macsyUi', 'bloomeisAssets']
  },
  'mcistd': {
    describe: 'maven clean install, skip tests and enforcer',
    choices: ['navApp', 'shopApp', 'macsyUi', 'bloomeisAssets']
  },
  'mjr': {
    describe: 'maven jetty run',
    choices: ['navApp', 'shopApp', 'bloomeisAssets']
  },
  'mjro': {
    describe: 'maven jetty run offline',
    choices: ['navApp', 'shopApp', 'bloomeisAssets']
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