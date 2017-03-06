exports.command = 'init <command>'
exports.desc = 'Initialize an os files, apps, or machine'
exports.builder = function (yargs) {
  return yargs.commandDir('init_cmds');
}
exports.handler = function (argv) {
}