exports.command = 'new <app'
exports.desc = 'New <app>'
exports.builder = function (yargs) {
  return yargs.commandDir('new_cmds')
}
exports.handler = function (argv) {
}