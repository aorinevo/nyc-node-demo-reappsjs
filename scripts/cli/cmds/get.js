exports.command = 'get <command>'
exports.desc = 'Get <command>'
exports.builder = function (yargs) {
  return yargs.commandDir('get_cmds')
}
exports.handler = function (argv) {}