exports.command = 'polaris'
exports.desc = 'Polaris [proj]'
exports.builder = function (yargs) {
  return yargs.options({
    'proj': {
      choices: ['creditGateway','customerPreferences'],
      demandOption: true
    }
  }).commandDir('polaris_cmds');
}
exports.handler = function (argv) {
}