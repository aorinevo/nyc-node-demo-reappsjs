module.exports = require('yargs').options({
  'action': {
    alias: 'a',
    describe: 'action',
    choices: ['initBox','listEnvs','initShopApEnv','initNavAppEnv','initBloomiesAssets','initEnvs','initCertAndKey', 'initProxyServer','initShell', 'initHosts','updateSdpHost', 'updateShopAppSdpHost', 'updateNavAppSdpHost','initHttpdVhosts', 'initServerBlocks', 'initM2', 'getIp', 'getReappsPropsJson', 'updateNavAppPomXml', 'updateShopAppPomXml', 'updateShopAppTmp', 'updateNavAppTmp', 'updateShopAppWebXml', 'updateNavAppWebXml']
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