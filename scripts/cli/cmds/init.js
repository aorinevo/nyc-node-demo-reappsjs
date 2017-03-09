exports.command = 'init <command>'
exports.desc = 'Init file, app, or machine'
exports.builder = function (yargs) {
  return yargs.commandDir('init_cmds');
}
exports.handler = function (argv) {
}