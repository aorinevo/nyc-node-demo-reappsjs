exports.command = 'run <app>'
exports.desc = 'Run <app>'
exports.builder = function (yargs) {
  return yargs.commandDir('run_cmds');
}
exports.handler = function (argv) {
}