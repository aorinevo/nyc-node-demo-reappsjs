exports.command = 'build <app>'
exports.desc = 'triggers build process for app'
exports.builder = function (yargs) {
  return yargs.commandDir('build_cmds');
}
exports.handler = function (argv) {
}