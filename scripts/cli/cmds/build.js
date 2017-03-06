exports.command = 'build [app..]'
exports.desc = 'Build <app>'
exports.builder = function (yargs) {
  return yargs.commandDir('build_cmds')
}
exports.handler = function (argv) {
}