exports.command = 'init <app>'
exports.desc = 'Initialize application'
exports.builder = function (yargs) {
  return yargs.commandDir('init_cmds');
}
exports.handler = function (argv) {
}