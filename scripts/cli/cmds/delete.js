exports.command = 'delete'
exports.desc = 'Delete'
exports.builder = function (yargs) {
  return yargs.commandDir('delete_cmds')
}
exports.handler = function (argv) {
}