exports.command = 'update <app>'
exports.desc = 'Update <app> files'
exports.builder = function (yargs) {
  return yargs.commandDir('update_cmds')
}
exports.handler = function (argv) {}