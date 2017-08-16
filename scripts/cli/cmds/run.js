exports.command = 'run <app>'
exports.desc = 'run app'
exports.builder = function (yargs) {
  return yargs.commandDir('run_cmds');
}
exports.handler = function (argv) {
}